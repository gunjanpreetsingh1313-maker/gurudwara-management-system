const Hukamnama = require('../models/Hukamnama');

exports.getHukamnama = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let hukamnama = await Hukamnama.findOne({ date: { $gte: today } }).sort({ date: -1 });
    if (!hukamnama) {
      hukamnama = await Hukamnama.findOne().sort({ date: -1 });
    }
    res.json(hukamnama);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHukamnama = async (req, res) => {
  try {
    const hukamnama = await Hukamnama.create(req.body);
    res.status(201).json(hukamnama);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllHukamnama = async (req, res) => {
  try {
    const items = await Hukamnama.find().sort({ date: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
