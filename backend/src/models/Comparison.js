const mongoose = require('mongoose');

const comparisonRowSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    us: { type: String, default: '', trim: true },
    them: { type: String, default: '', trim: true },
  },
  { _id: false }
);

// Singleton content block that powers the home page "The Comparison" table.
const comparisonSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'home-comparison', unique: true, index: true },
    eyebrow: { type: String, default: 'The Comparison', trim: true },
    heading: { type: String, default: '', trim: true },
    headingAccent: { type: String, default: '', trim: true },
    columns: { type: [String], default: ['', 'LLC Publications', 'Other Competitors'] },
    rows: { type: [comparisonRowSchema], default: [] },
    ctaLabel: { type: String, default: 'Get Started Now →', trim: true },
    ctaHref: { type: String, default: '#order', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comparison', comparisonSchema);
