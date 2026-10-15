const express = require('express');
const Order = require('../models/Order');
const Article = require('../models/Article');
const CountyPrice = require('../models/CountyPrice');

const router = express.Router();

// ADMIN dashboard aggregates
router.get('/stats', async (req, res, next) => {
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
