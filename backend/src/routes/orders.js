const express = require('express');
const Order = require('../models/Order');
const CountyPrice = require('../models/CountyPrice');
const { orderSchema, validate } = require('../middleware/validate');

const router = express.Router();

// PUBLIC: create order from "Place your publication order" form.
// Price is resolved server-side from CountyPrice so clients cannot spoof totals.
router.post('/', validate(orderSchema), async (req, res, next) => {
  try {
    const { county, jurisdictionStatus } = req.body;
    const priceDoc = await CountyPrice.findOne({ county: new RegExp(`^${county}$`, 'i') });
    if (!priceDoc || !priceDoc.isActive) {
      const err = new Error(`County "${county}" is not currently serviced`);
      err.status = 400;
      throw err;
    }
    const amount =
      jurisdictionStatus === 'Foreign' && priceDoc.priceForeign != null
        ? priceDoc.priceForeign
        : priceDoc.price;

    const order = await Order.create({ ...req.body, amount });
    res.status(201).json({ ok: true, order });
  } catch (e) {
    next(e);
  }
});

// ADMIN: list with pagination / search / status filter
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { llcName: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { county: new RegExp(q, 'i') },
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
      ];
    }
    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Order.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const allowed = ['status', 'paymentStatus', 'adminNotes', 'amount'];
    const patch = {};
    for (const k of allowed) if (req.body[k] !== undefined) patch[k] = req.body[k];
    const order = await Order.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ok: true, order });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const r = await Order.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'Order not found' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
