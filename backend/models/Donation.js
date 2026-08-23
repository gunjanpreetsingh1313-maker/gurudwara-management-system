const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    donorName: String,
    donorEmail: String,
    donorPhone: String,
    paymentMode: {
      type: String,
      enum: ['Cash', 'UPI', 'Bank Transfer', 'Online', 'Cheque', 'Other'],
      default: 'Cash',
    },
    category: {
      type: String,
      enum: ['Dasvandh', 'Langar Donation', 'Online Donation', 'Cash Donation', 'Bank Transfer', 'General'],
      default: 'General',
    },
    description: String,
    status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'confirmed' },
    transactionId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
