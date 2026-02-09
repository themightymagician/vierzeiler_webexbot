const webex = require('./index');
const { addSubscriber, removeSubscriber } = require('./messageHandler');

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

