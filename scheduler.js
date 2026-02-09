const cron = require('node-cron');
const sendVierzeiler = require('./sendVierzeiler');
const { getSubscribers } = require('./messageHandler');

cron.schedule('0 9 * * 1', () => {
  const users = getSubscribers();

  if (!users.length) {
    console.log("ℹ️ Keine abonnierten Nutzer");
    return;
  }

  users.forEach(email => {
    if (email) {
      sendVierzeiler(email);
    } else {
      console.warn("⚠️ Leerer Eintrag in Subscriber-Liste");
    }
  });
});

