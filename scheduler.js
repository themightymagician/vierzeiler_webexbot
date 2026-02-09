const cron = require('node-cron');
const sendVierzeiler = require('./sendVierzeiler');
const { getSubscribers } = require('./messageHandler');

// Jeden Montag um 09:00
cron.schedule('0 9 * * 1', () => {
  const users = getSubscribers();
  users.forEach(email => sendVierzeiler(email));
});


const pollMessages = require('./listener');
pollMessages();
