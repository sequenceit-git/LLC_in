const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    tag: { type: String, default: 'Service', trim: true },
    contentHtml: { type: String, required: true },
    readingTime: { type: String, default: '8 minutes' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
