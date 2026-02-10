const webex = require('./index');
const { addSubscriber, removeSubscriber } = require('./messageHandler');

async function handleMessage(msg) {
  const text = msg.text.toLowerCase();
  const email = msg.personEmail;

  if (text === 'anmelden') {
    const added = await addSubscriber(email);
    await webex.post('/messages', {
      toPersonEmail: email,
      text: added ? 'Du bist jetzt angemeldet!' : 'Du bist bereits angemeldet.'
    });
  }

  if (text === 'abbestellen' || text === 'abmelden') {
    await removeSubscriber(email);
    await webex.post('/messages', {
      toPersonEmail: email,
      text: 'Du wurdest abgemeldet.'
    });
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

      for (const msg of items) {
        await handleMessage(msg);
      }

      lastTimestamp = items[items.length - 1].created;
    } catch (err) {
      console.error('Fehler beim Polling:', err);
    }
  }, 5000);
}

module.exports = pollMessages;
