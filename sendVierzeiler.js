const webex = require('./index');
const getVierzeiler = require('./vierzeiler');

async function sendVierzeiler(email) {
  if (!email) {
    console.error("❌ sendVierzeiler called without email");
    return;
  }

  const text = getVierzeiler();

  try {
    await webex.post('/messages', {
      toPersonEmail: email,
      text
    });

    console.log(`✅ Vierzeiler gesendet an ${email}`);
  } catch (err) {
    console.error("❌ Webex send error:", err.response?.data || err.message);
  }
}

module.exports = sendVierzeiler;


