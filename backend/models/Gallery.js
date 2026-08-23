const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: String,
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true },
    thumbnail: String,
    album: { type: String, default: 'General' },
    caption: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
