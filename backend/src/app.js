const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
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

// Root: avoids {"error":"Not found","path":"/"} on hosts that probe "/"
app.get('/', (req, res) =>
  res.json({
    ok: true,
    name: 'LLC Publication Online API',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/prices', '/api/orders', '/api/articles', '/api/admin/stats'],
  })
);
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/orders', ordersRouter);
app.use('/api/prices', pricesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
