const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    q: { type: String, required: true, trim: true },
    a: { type: String, required: true, trim: true },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faq', faqSchema);
