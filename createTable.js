const db = require('./db'); // dein Pool-Modul

const createTableQuery = `
CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

db.query(createTableQuery)
  .then(() => {
    console.log("Tabelle 'subscribers' erfolgreich erstellt!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Fehler beim Erstellen der Tabelle:", err);
    process.exit(1);
  });
