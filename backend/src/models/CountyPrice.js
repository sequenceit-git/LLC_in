const mongoose = require('mongoose');

const countyPriceSchema = new mongoose.Schema(
  {
    county: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    // Optional foreign-LLC override. If null, base price applies to both.
    priceForeign: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CountyPrice', countyPriceSchema);
