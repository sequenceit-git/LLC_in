require('./config/env');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
connectDB(process.env.DB_URI || process.env.MONGODB_URI)
  .then(() => {
    // Auto-seed counties/articles on first boot if collections are empty (idempotent)
    const { seed } = require('./seed');
    const CountyPrice = require('./models/CountyPrice');
    return CountyPrice.estimatedDocumentCount().then((n) => (n === 0 ? seed() : null));
  })
  .then(() => app.listen(PORT, () => console.log(`API listening on :${PORT}`)))
  .catch((e) => { console.error('Boot failed:', e.message); process.exit(1); });
