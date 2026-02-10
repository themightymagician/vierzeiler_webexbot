require('dotenv').config();
const axios = require('axios');
const pollMessages = require('./listener');

// Erstelle einen Webex-Client
const webex = axios.create({
  baseURL: 'https://webexapis.com/v1',
  headers: {
    Authorization: process.env.WEBEX_BOT_TOKEN,
    'Content-Type': 'application/json'
  }
});

module.exports = webex;

// Polling starten
console.log('Webex-Bot startet...');
pollMessages()
  .catch(err => {
    console.error('Fehler beim Starten des Pollings:', err);
    process.exit(1); // Railway kann den Prozess neu starten
  });

