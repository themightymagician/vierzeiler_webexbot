const webex = require('./index');
const { addSubscriber, removeSubscriber } = require('./messageHandler');

async function pollMessages() {
  let lastTimestamp = new Date().toISOString();

  setInterval(async () => {
    const res = await webex.get('/messages', {
      params: {
        max: 50,
        mentionedPeople: 'me',
        // erzwingt Abfrage nach neuen Nachrichten
        from: lastTimestamp
      }
    });

    const items = res.data.items;
    if (!items.length) return;

    items.forEach(msg => handleMessage(msg));
    lastTimestamp = new Date().toISOString();

  }, 5000); // alle 5 Sekunden
}

async function handleMessage(msg) {
  // Nur 1:1 Direktnachrichten
  if (msg.roomType !== 'direct') return;

  const text = msg.text.trim().toLowerCase();
  const email = msg.personEmail;

  if (text === 'anmelden') {
    if (addSubscriber(email)) {
      await webex.post('/messages', {
        toPersonEmail: email,
        text: 'Du bist jetzt angemeldet!'
      });
    } else {
      await webex.post('/messages', {
        toPersonEmail: email,
        text: 'Du bist bereits angemeldet.'
      });
    }
  }

  if (text === 'abbestellen' || text === 'abmelden') {
    removeSubscriber(email);
    await webex.post('/messages', {
      toPersonEmail: email,
      text: 'Du wurdest abgemeldet.'
    });
  }
}

module.exports = pollMessages;
