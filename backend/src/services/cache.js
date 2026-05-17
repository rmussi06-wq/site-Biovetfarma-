const admin = require('firebase-admin');

let initialized = false;

function initFirebase() {
  if (initialized) return;
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT || './firebase-service-account.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  initialized = true;
}

let cache = null;
let cacheTs = 0;
const TTL = 5 * 60 * 1000;

async function getProducts() {
  if (cache && Date.now() - cacheTs < TTL) return cache;

  initFirebase();
  const snap = await admin.firestore()
    .collection('products')
    .where('active', '==', true)
    .orderBy('order')
    .get();

  cache = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  cacheTs = Date.now();
  return cache;
}

function invalidateCache() {
  cache = null;
  cacheTs = 0;
}

module.exports = { getProducts, invalidateCache };
