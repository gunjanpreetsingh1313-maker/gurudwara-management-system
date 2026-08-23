const mongoose = require('mongoose');

const hukamnamaSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    gurmukhi: String,
    translation: String,
    ang: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hukamnama', hukamnamaSchema);
