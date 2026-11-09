const express = require('express');
const ContactInfo = require('../models/ContactInfo');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const KEY = 'site-contact';

const DEFAULT_CONTACT = {
  email: 'info@llcpublications.com',
  phone: '(888) 484-2204',
  hours: 'M–F · 8a–6p ET',
  address: 'New York, NY',
  portalUrl: 'https://portal.llcpublications.com/',
  legalName: 'LLC Publications',
  notice: 'Customer support inquiries are typically answered within 24 business hours.',
};

function sanitize(body = {}) {
  const patch = {};
  if (typeof body.email === 'string') patch.email = body.email.trim();
  if (typeof body.phone === 'string') patch.phone = body.phone.trim();
  if (typeof body.hours === 'string') patch.hours = body.hours.trim();
  if (typeof body.address === 'string') patch.address = body.address.trim();
  if (typeof body.portalUrl === 'string') patch.portalUrl = body.portalUrl.trim();
  if (typeof body.legalName === 'string') patch.legalName = body.legalName.trim();
  if (typeof body.notice === 'string') patch.notice = body.notice.trim();
  return patch;
}

// PUBLIC: get site contact information (auto-creates default on first read)
router.get('/', async (req, res, next) => {
  try {
    let item = await ContactInfo.findOne({ key: KEY }).lean();
    if (!item) {
      const created = await ContactInfo.create({ key: KEY, ...DEFAULT_CONTACT });
      item = created.toObject();
    } else if (
      item.legalName === 'LLC Publications Online' ||
      item.legalName === 'LLC Publication Online' ||
      item.portalUrl === 'https://portal.llcpublicationonline.com/'
    ) {
      const updates = {};
      if (item.legalName === 'LLC Publications Online' || item.legalName === 'LLC Publication Online') {
        updates.legalName = 'LLC Publications';
      }
      if (item.portalUrl === 'https://portal.llcpublicationonline.com/') {
        updates.portalUrl = 'https://portal.llcpublications.com/';
      }
      await ContactInfo.updateOne({ key: KEY }, { $set: updates });
      item = { ...item, ...updates };
    }
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// ADMIN: update site contact information
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const patch = sanitize(req.body);
    const item = await ContactInfo.findOneAndUpdate(
      { key: KEY },
      { $set: patch },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// ADMIN: reset contact information to defaults
router.post('/reset', requireAuth, async (req, res, next) => {
  try {
    const item = await ContactInfo.findOneAndUpdate(
      { key: KEY },
      { $set: DEFAULT_CONTACT },
      { new: true, upsert: true }
    ).lean();
    res.json({ ok: true, item, reset: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
module.exports.DEFAULT_CONTACT = DEFAULT_CONTACT;

