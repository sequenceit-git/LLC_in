const express = require('express');
const Comparison = require('../models/Comparison');
const { DEFAULT_COMPARISON } = require('../data/initialComparison');

const router = express.Router();

const KEY = 'home-comparison';

function sanitize(body) {
  const patch = {};
  if (typeof body.eyebrow === 'string') patch.eyebrow = body.eyebrow.trim();
  if (typeof body.heading === 'string') patch.heading = body.heading.trim();
  if (typeof body.headingAccent === 'string') patch.headingAccent = body.headingAccent.trim();
  if (Array.isArray(body.columns)) {
    patch.columns = body.columns.slice(0, 3).map((c) => String(c ?? '').trim());
  }
  if (Array.isArray(body.rows)) {
    patch.rows = body.rows
      .map((r) => ({
        label: String(r?.label ?? '').trim(),
        us: String(r?.us ?? '').trim(),
        them: String(r?.them ?? '').trim(),
      }))
      .filter((r) => r.label.length > 0);
  }
  if (typeof body.ctaLabel === 'string') patch.ctaLabel = body.ctaLabel.trim();
  if (typeof body.ctaHref === 'string') patch.ctaHref = body.ctaHref.trim();
  return patch;
}

// PUBLIC: comparison block for the home page (auto-creates the default on first read)
router.get('/', async (req, res, next) => {
  try {
    let item = await Comparison.findOne({ key: KEY }).lean();
    if (!item) {
      const created = await Comparison.create({ key: KEY, ...DEFAULT_COMPARISON });
      item = created.toObject();
    }
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// ADMIN: update the comparison block
router.put('/', async (req, res, next) => {
  try {
    const patch = sanitize(req.body);
    const item = await Comparison.findOneAndUpdate(
      { key: KEY },
      { $set: patch, $setOnInsert: { key: KEY } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// ADMIN: restore the shipped defaults
router.post('/reset', async (req, res, next) => {
  try {
    const item = await Comparison.findOneAndUpdate(
      { key: KEY },
      { $set: { ...DEFAULT_COMPARISON }, $setOnInsert: { key: KEY } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
