// vierzeiler.js

const vierzeiler = [
  "Sekundenkleber klebt Sekunden.\n",
  "Erst zu Minuten, dann zu Stunden.\n",
  "So entstehen mit der Zeit\n",
  "auch Jahre und die Ewigkeit."
];

// Funktion zum Abrufen des aktuellen Vierzeilers
function getCurrentVierzeiler() {
  return vierzeiler.join('');
}

module.exports = { getCurrentVierzeiler };
