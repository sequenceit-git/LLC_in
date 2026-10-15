require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errors');

const ordersRouter = require('./routes/orders');
const pricesRouter = require('./routes/prices');
const articlesRouter = require('./routes/articles');
const adminRouter = require('./routes/admin');

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(','), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const orderLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });
app.use('/api/orders', (req, res, next) => (req.method === 'POST' ? orderLimiter(req, res, next) : next()));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/orders', ordersRouter);
app.use('/api/prices', pricesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

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
