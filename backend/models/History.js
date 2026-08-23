const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  year: String,
  title: String,
  description: String,
});

const historySchema = new mongoose.Schema(
  {
    establishmentDate: String,
    founder: {
      name: String,
      description: String,
      image: String,
    },
    history: String,
    mission: String,
    vision: String,
    timeline: [timelineItemSchema],
    photos: [{ url: String, caption: String }],
    videos: [{ url: String, title: String, thumbnail: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);
