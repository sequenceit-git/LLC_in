const mongoose = require('mongoose');

// Singleton content model for website contact information and support channels.
const contactInfoSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site-contact', unique: true, index: true },
    email: { type: String, default: 'info@llcpublications.com', trim: true },
    phone: { type: String, default: '(888) 484-2204', trim: true },
    hours: { type: String, default: 'M–F · 8a–6p ET', trim: true },
    address: { type: String, default: 'New York, NY', trim: true },
    portalUrl: { type: String, default: 'https://portal.llcpublicationonline.com/', trim: true },
    legalName: { type: String, default: 'LLC Publications Online', trim: true },
    notice: {
      type: String,
      default: 'Customer support inquiries are typically answered within 24 business hours.',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
