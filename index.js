const pollMessages = require('./listener');

// Polling starten
console.log('Webex-Bot startet...');
pollMessages()
  .catch(err => {
    console.error('Fehler beim Starten des Pollings:', err);
    process.exit(1); // Railway kann den Prozess neu starten
  });
