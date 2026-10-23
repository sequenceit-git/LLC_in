const express = require('express');
const Policy = require('../models/Policy');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET all policies
router.get('/', async (req, res, next) => {
  try {
    const items = await Policy.find({}).sort({ title: 1 }).lean();
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
});

// GET policy by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const item = await Policy.findOne({ slug: req.params.slug.toLowerCase() }).lean();
    if (!item) return res.status(404).json({ error: 'Policy statement not found' });
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// PUT update or create policy by slug (Admin)
router.put('/:slug', requireAuth, async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const { title, meta, contentHtml, category } = req.body;
    const item = await Policy.findOneAndUpdate(
      { slug },
      { $set: { title, meta, contentHtml, category } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// POST create policy (Admin)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const item = await Policy.create(req.body);
    res.status(201).json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// DELETE policy by slug (Admin)
router.delete('/:slug', requireAuth, async (req, res, next) => {
  try {
    const r = await Policy.findOneAndDelete({ slug: req.params.slug.toLowerCase() });
    if (!r) return res.status(404).json({ error: 'Policy not found' });
    res.json({ ok: true, deleted: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
