const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['Donations', 'Dasvandh', 'Langar Donation', 'Online Donation', 'Cash Donation', 'Bank Transfer', 'Other Income'],
      required: true,
    },
    donorName: String,
    paymentMode: {
      type: String,
      enum: ['Cash', 'UPI', 'Bank Transfer', 'Online', 'Cheque', 'Other'],
      default: 'Cash',
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
