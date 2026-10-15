// Centralised error + 404 middleware (production-grade: no stack leaks)
function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const payload = { error: err.message || 'Internal server error' };
  if (err.details) payload.details = err.details;
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack;
  res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };
