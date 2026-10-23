const express = require('express');
const Faq = require('../models/Faq');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET active FAQs for public site
router.get('/', async (req, res, next) => {
  try {
    const items = await Faq.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
});

// GET all FAQs for admin
router.get('/all', requireAuth, async (req, res, next) => {
  try {
    const items = await Faq.find({}).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
});

// POST create FAQ
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { q, a, order = 0, isActive = true } = req.body;
    if (!q || !a) return res.status(400).json({ error: 'Question and answer are required' });
    const item = await Faq.create({ q, a, order, isActive });
    res.status(201).json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// PUT update FAQ
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { q, a, order, isActive } = req.body;
    const item = await Faq.findByIdAndUpdate(
      req.params.id,
      { $set: { q, a, order, isActive } },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// DELETE FAQ
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await Faq.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ ok: true, deleted: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
