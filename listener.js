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


if (text === 'anmelden') {
  const added = await addSubscriber(email);

  await webex.post('/messages', {
    toPersonEmail: email,
    text: added
      ? 'Du bist jetzt angemeldet!'
      : 'Du bist bereits angemeldet.'
  });
}

if (text === 'abbestellen' || text === 'abmelden') {
  await removeSubscriber(email);

  await webex.post('/messages', {
    toPersonEmail: email,
    text: 'Du wurdest abgemeldet.'
  });
}


module.exports = pollMessages;


