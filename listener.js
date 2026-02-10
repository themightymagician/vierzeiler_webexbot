const webex = require('./webexClient');
const { addSubscriber, removeSubscriber } = require('./messageHandler');

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

async function pollMessages() {
  let lastTimestamp = new Date().toISOString();

  setInterval(async () => {
    try {
      const res = await webex.get('/messages', {
        params: {
          max: 50,
          mentionedPeople: 'me',
          from: lastTimestamp
        }
      });

      const items = res.data.items;
      if (!items.length) return;

      await Promise.all(items.map(msg => handleMessage(msg)));

      // Letzten Zeitstempel auf die neueste Nachricht setzen
      lastTimestamp = items[items.length - 1].created;
    } catch (err) {
      console.error('Fehler beim Polling:', err);
    }
  }, 5000); // alle 5 Sekunden
}

module.exports = pollMessages;

