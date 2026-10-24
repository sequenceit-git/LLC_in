// Vercel serverless entry: reuses one cached Mongo connection across invocations.
const mongoose = require('mongoose');
const app = require('../src/app');

let cached = global.__mongooseConn || null;
global.__mongooseConn = cached;

async function ensureDB() {
  if (mongoose.connection.readyState === 1) return;
  if (cached) {
    await cached;
    return;
  }
  mongoose.set('strictQuery', true);
  cached = mongoose.connect(process.env.DB_URI || process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  global.__mongooseConn = cached;
  await cached;
  // Seed on first-ever deploy if collections are empty (idempotent)
  const CountyPrice = require('../src/models/CountyPrice');
  if ((await CountyPrice.estimatedDocumentCount()) === 0) {
    await require('../src/seed').seed();
  }
}

module.exports = async (req, res) => {
  // Let Express handle preflight CORS OPTIONS requests immediately without waiting for DB connection
  if (req.method === 'OPTIONS') {
    return app(req, res);
  }

  try {
    await ensureDB();
  } catch (e) {
    res.status(500).json({ error: 'Database unavailable', details: e.message });
    return;
  }
  return app(req, res);
};
