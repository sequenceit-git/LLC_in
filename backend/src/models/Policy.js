const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true },
    meta: { type: String, default: 'Last updated: May 2026 · LLC Publications' },
    contentHtml: { type: String, required: true },
    category: { type: String, default: 'legal', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);
