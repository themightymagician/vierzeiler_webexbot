require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webex = require('axios').create({
  baseURL: 'https://webexapis.com/v1',
  headers: {
    Authorization: `${process.env.WEBEX_TOKEN}`,
    'Content-Type': 'application/json'
  }
});
const { addSubscriber, removeSubscriber } = require('./messageHandler');

const app = express();
app.use(bodyParser.json());

async function handleMessage(msg) {
  if (!msg || !msg.text || !msg.personEmail) return;

  const text = msg.text.toLowerCase();
  const email = msg.personEmail;

  try {
    if (text === 'anmelden') {
      const added = await addSubscriber(email);
      await webex.post('/messages', {
        toPersonEmail: email,
        text: added
          ? 'Du bist jetzt angemeldet!'
          : 'Du bist bereits angemeldet.'
      });
    } else if (text === 'abbestellen' || text === 'abmelden') {
      await removeSubscriber(email);
      await webex.post('/messages', {
        toPersonEmail: email,
        text: 'Du wurdest abgemeldet.'
      });
    }
  } catch (err) {
    console.error(`Fehler beim Verarbeiten der Nachricht von ${email}:`, err);
  }
}

// Webhook-Endpunkt
app.post('/webhook', async (req, res) => {
  const msgId = req.body.data?.id;
  if (!msgId) return res.status(400).send('No message ID');

  try {
    // Nachricht von Webex abrufen
    const response = await webex.get(`/messages/${msgId}`);
    const msg = response.data;
    await handleMessage(msg);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Fehler beim Verarbeiten des Webhooks:', err);
    res.status(500).send('Error');
  }
});

// Starten des Servers
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook-Server läuft auf Port ${PORT}`);
});
