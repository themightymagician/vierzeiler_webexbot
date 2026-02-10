const db = require('./db');

async function getCurrentVierzeiler() {
  const today = new Date();
  const oneJan = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = ((today - oneJan + 86400000) / 86400000);
  const weekNumber = Math.ceil((dayOfYear + oneJan.getDay()) / 7);

  try {
    const res = await db.query(
      'SELECT text FROM vierzeiler WHERE week = $1 LIMIT 1',
      [weekNumber]
    );
    if (res.rows.length > 0) return res.rows[0].text;
    return 'Der aktuelle Vierzeiler ist noch nicht gesetzt.';
  } catch (err) {
    console.error('DB getCurrentVierzeiler error', err.message);
    return 'Fehler beim Abrufen des Vierzeilers.';
  }
}

module.exports = { getCurrentVierzeiler };
