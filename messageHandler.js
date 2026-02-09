const fs = require('fs');
const path = require('path');

const subscribedFile = path.join(__dirname, 'subscribed.json');

// Stellen sicher, dass Datei existiert
if (!fs.existsSync(subscribedFile)) {
  fs.writeFileSync(subscribedFile, JSON.stringify([]));
}

function getSubscribers() {
  if (!fs.existsSync(subscribedFile)) {
    return [];
  }

  const raw = fs.readFileSync(subscribedFile, 'utf8');
  if (!raw) return [];

  return JSON.parse(raw).filter(Boolean);
}

function saveSubscribers(list) {
  fs.writeFileSync(subscribedFile, JSON.stringify(list, null, 2));
}

module.exports = {
  getSubscribers,
  addSubscriber(email) {
    const list = getSubscribers();
    if (!list.includes(email)) {
      list.push(email);
      saveSubscribers(list);
      return true;
    }
    return false;
  },
  removeSubscriber(email) {
    const list = getSubscribers().filter(e => e !== email);
    saveSubscribers(list);
  }
};

