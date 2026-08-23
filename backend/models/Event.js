const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['Gurpurab', 'Akhand Path', 'Kirtan', 'Langar Seva', 'Blood Donation Camp', 'Youth Camp', 'Other'],
      default: 'Other',
    },
    date: { type: Date, required: true },
    time: String,
    description: String,
    banner: String,
    gallery: [{ url: String, caption: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
