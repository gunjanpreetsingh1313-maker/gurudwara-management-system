const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    contact: String,
    email: String,
    photo: String,
    duration: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Committee', committeeSchema);
