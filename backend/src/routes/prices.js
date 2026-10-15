const express = require('express');
const CountyPrice = require('../models/CountyPrice');
const { priceUpsertSchema, validate } = require('../middleware/validate');

const router = express.Router();

// PUBLIC: price list for pricing grid + order form dropdown
router.get('/', async (req, res, next) => {
  try {
    const items = await CountyPrice.find({ isActive: true }).sort({ county: 1 });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// ADMIN: full list incl. inactive
router.get('/all', async (req, res, next) => {
  try {
    const items = await CountyPrice.find({}).sort({ county: 1 });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// ADMIN: create or update single county
router.put('/:county', validate(priceUpsertSchema), async (req, res, next) => {
  try {
    const doc = await CountyPrice.findOneAndUpdate(
      { county: new RegExp(`^${req.params.county}$`, 'i') },
      { $set: { ...req.body, county: req.body.county } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ ok: true, item: doc });
  } catch (e) {
    next(e);
  }
});

// ADMIN: bulk upsert [{county, price, ...}]
router.post('/bulk', async (req, res, next) => {
  try {
    const rows = Array.isArray(req.body.items) ? req.body.items : [];
    if (!rows.length) return res.status(400).json({ error: 'items[] required' });
    const ops = rows.map((r) => ({
      updateOne: {
        filter: { county: r.county },
        update: { $set: { county: r.county, price: r.price, priceForeign: r.priceForeign ?? null, isActive: r.isActive ?? true } },
        upsert: true,
      },
    }));
    await CountyPrice.bulkWrite(ops);
    const items = await CountyPrice.find({}).sort({ county: 1 });
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
