const cron = require('node-cron');
const sendVierzeiler = require('./sendVierzeiler');
const { getSubscribers } = require('./messageHandler');

cron.schedule('0 9 * * 1', async () => {
  const users = await getSubscribers();

  if (!users.length) {
    console.log('ℹ️ Keine Abonnenten');
    return;
  }

  for (const email of users) {
    await sendVierzeiler(email);
  }
});
