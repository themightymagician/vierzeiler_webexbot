require('dotenv').config();
const axios = require('axios');

const webex = axios.create({
  baseURL: 'https://webexapis.com/v1',
  headers: {
    Authorization: process.env.WEBEX_BOT_TOKEN,
    'Content-Type': 'application/json'
  }
});

const pollMessages = require('./listener');
pollMessages(); // Polling starten

module.exports = webex;

