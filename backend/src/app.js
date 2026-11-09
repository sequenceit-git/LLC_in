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
const policiesRouter = require('./routes/policies');
const faqsRouter = require('./routes/faqs');
const comparisonRouter = require('./routes/comparison');
const contactRouter = require('./routes/contact');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: false }));

const explicitOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (like server-to-server or curl)
    if (!origin) return callback(null, true);

    const clean = origin.replace(/\/$/, '');

    // Allow explicit origins or localhost
    if (
      explicitOrigins.includes(clean) ||
      clean.startsWith('http://localhost:') ||
      clean.startsWith('http://127.0.0.1:') ||
      explicitOrigins.includes('*') ||
      explicitOrigins.length === 0
    ) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const orderLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });
app.use('/api/orders', (req, res, next) => (req.method === 'POST' ? orderLimiter(req, res, next) : next()));

// Root: avoids {"error":"Not found","path":"/"} on hosts that probe "/"
app.get('/', (req, res) =>
  res.json({
    ok: true,
    name: 'LLC Publications API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/prices',
      '/api/orders',
      '/api/articles',
      '/api/policies',
      '/api/faqs',
      '/api/comparison',
      '/api/contact',
      '/api/admin/stats',
    ],
  })
);
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/orders', ordersRouter);
app.use('/api/prices', pricesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/comparison', comparisonRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
