const db = require('./db');

module.exports = {
  async addSubscriber(email) {
    try {
      const res = await db.query(
        'INSERT INTO subscribers(email) VALUES($1) ON CONFLICT DO NOTHING',
        [email]
      );
      return res.rowCount > 0;
    } catch (err) {
      console.error('DB addSubscriber error', err.message);
      return false;
    }
  },

  async removeSubscriber(email) {
    try {
      await db.query(
        'DELETE FROM subscribers WHERE email = $1',
        [email]
      );
    } catch (err) {
      console.error('DB removeSubscriber error', err.message);
    }
  },

  async getSubscribers() {
    try {
      const res = await db.query(
        'SELECT email FROM subscribers'
      );
      return res.rows.map(r => r.email);
    } catch (err) {
      console.error('DB getSubscribers error', err.message);
      return [];
    }
  }
};
