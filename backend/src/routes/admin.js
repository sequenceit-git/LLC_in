const express = require('express');
const rateLimit = require('express-rate-limit');
const AdminUser = require('../models/AdminUser');
const Order = require('../models/Order');
const Article = require('../models/Article');
const CountyPrice = require('../models/CountyPrice');
const { requireAuth, signToken } = require('../middleware/auth');

const router = express.Router();

// Strict rate limiter on login endpoint: max 8 attempts per 15 mins to prevent brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const admin = await AdminUser.findOne({ username: cleanUser });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await admin.comparePassword(String(password));
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = signToken(admin);

    res.json({
      ok: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/me - Verify current token / session
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const admin = await AdminUser.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found' });
    }
    res.json({ ok: true, user: admin });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/stats - Protected admin dashboard aggregates
router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const [totalOrders, newOrders, publishedArticles, counties] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'new' }),
      Article.countDocuments({ status: 'published' }),
      CountyPrice.countDocuments({ isActive: true }),
    ]);
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'pending'] }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({
      totalOrders,
      newOrders,
      publishedArticles,
      counties,
      pipelineRevenue: revenue[0]?.total || 0,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
