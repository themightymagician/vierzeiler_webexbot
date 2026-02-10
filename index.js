require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cron = require('node-cron');

const { addSubscriber, removeSubscriber, getSubscribers } = require('./messageHandler');
const { getCurrentVierzeiler } = require('./vierzeiler');

const app = express();
app.use(bodyParser.json());

// Webex API-Client
const webex = axios.create({
  baseURL: 'https://webexapis.com/v1',
  headers: {
    Authorization: `${process.env.WEBEX_BOT_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Hilfsfunktion: Nachricht senden
async function sendMessage(email, text) {
  try {
    await webex.post('/messages', { toPersonEmail: email, text });
  } catch (err) {
    console.error(`Fehler beim Senden der Nachricht an ${email}:`, err.response?.data || err.message);
  }
}

// Verarbeitung von Nachrichten
async function handleMessage(msg) {
  if (!msg || !msg.text || !msg.personEmail) return;

  const text = msg.text.toLowerCase();
  const email = msg.personEmail;

  try {
    if (text === 'anmelden') {
      const added = await addSubscriber(email);

      if (added) {
        await sendMessage(email, 'Du bist jetzt angemeldet!');

        // Sofort den aktuellen Vierzeiler senden
        const vierzeiler = getCurrentVierzeiler();
        await sendMessage(email, `Hier ist dein Vierzeiler der Woche:\n\n${vierzeiler}`);
      } else {
        await sendMessage(email, 'Du bist bereits angemeldet.');
      }
    } else if (text === 'abbestellen' || text === 'abmelden') {
      await removeSubscriber(email);
      await sendMessage(email, 'Du wurdest abgemeldet.');
    }
  } catch (err) {
    console.error(`Fehler beim Verarbeiten der Nachricht von ${email}:`, err);
  }
}

// Webhook-Endpunkt
app.post('/webhook', async (req, res) => {
  console.log('Webhook empfangen:', req.body); // 🔍 Debug
  const msgId = req.body.data?.id;
  if (!msgId) return res.status(400).send('No message ID');

  try {
    const response = await webex.get(`/messages/${msgId}`);
    const msg = response.data;
    await handleMessage(msg);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Fehler beim Verarbeiten des Webhooks:', err);
    res.status(500).send('Error');
  }
});

// Cron-Job: Jeden Montag um 09:00 Uhr
cron.schedule('0 9 * * 1', async () => {
  try {
    const subscribers = await getSubscribers(); // aus DB
    const vierzeiler = getCurrentVierzeiler();

    for (const email of subscribers) {
      await sendMessage(email, `Neuer Vierzeiler der Woche:\n\n${vierzeiler}`);
    }

    console.log('Wöchentlicher Vierzeiler wurde gesendet.');
  } catch (err) {
    console.error('Fehler beim Senden des wöchentlichen Vierzeilers:', err);
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook-Server läuft auf Port ${PORT}`);
});


