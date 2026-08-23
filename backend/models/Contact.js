const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    address: String,
    phone: String,
    email: String,
    mapEmbedUrl: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String,
    qrCodeImage: String,
    donationMethods: String,
    feedback: [
      {
        name: String,
        email: String,
        phone: String,
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
