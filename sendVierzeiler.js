const webex = require('./index');
const getVierzeiler = require('./vierzeiler');

async function sendVierzeiler(email) {
  const text = getVierzeiler();

  await webex.post('/messages', {
    toPersonEmail: tyllack@dkms.de,
    text
  });

  console.log(`Vierzeiler gesendet an ${email}`);
}

module.exports = sendVierzeiler;
