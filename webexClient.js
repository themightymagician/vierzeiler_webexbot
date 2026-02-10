// webexClient.js
require('dotenv').config();
const axios = require('axios');

const webex = axios.create({
  baseURL: 'https://webexapis.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.WEBEX_BOT_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

module.exports = webex;
