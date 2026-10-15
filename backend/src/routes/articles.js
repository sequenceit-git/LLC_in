const express = require('express');
const Article = require('../models/Article');
const { articleSchema, validate } = require('../middleware/validate');

const router = express.Router();

// PUBLIC: published list (resources grid)
router.get('/', async (req, res, next) => {
  try {
    const onlyPublished = req.query.all !== '1';
    const filter = onlyPublished ? { status: 'published' } : {};
    const items = await Article.find(filter).sort({ featured: -1, updatedAt: -1 });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// PUBLIC: single article by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const a = await Article.findOne({ slug: req.params.slug.toLowerCase() });
    if (!a) return res.status(404).json({ error: 'Article not found' });
    res.json({ item: a });
  } catch (e) {
    next(e);
  }
});

// ADMIN: create
router.post('/', validate(articleSchema), async (req, res, next) => {
  try {
    const a = await Article.create(req.body);
    res.status(201).json({ ok: true, item: a });
  } catch (e) {
    if (e.code === 11000) {
      e.status = 409;
      e.message = 'Slug already exists';
    }
    next(e);
  }
});

// ADMIN: update (partial)
router.put('/:id', async (req, res, next) => {
  try {
    const a = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!a) return res.status(404).json({ error: 'Article not found' });
    res.json({ ok: true, item: a });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const r = await Article.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'Article not found' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
