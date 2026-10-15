const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    llcName: { type: String, required: true, trim: true, maxlength: 200 },
    jurisdictionStatus: { type: String, enum: ['Domestic', 'Foreign'], default: 'Domestic' },
    county: { type: String, required: true, trim: true, index: true },
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },
    discountCode: { type: String, trim: true, default: '' },
    amount: { type: Number, required: true, min: 0 },
    // Payment is collected via Stripe on the original site. We store a reference only.
    // For now orders are recorded as pending payment confirmation by admin.
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['new', 'processing', 'publishing', 'filed', 'completed', 'cancelled'],
      default: 'new',
      index: true,
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
