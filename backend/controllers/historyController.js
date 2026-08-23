const History = require('../models/History');

exports.getHistory = async (req, res) => {
  try {
    let history = await History.findOne();
    if (!history) {
      history = await History.create({
        establishmentDate: '1985',
        founder: { name: 'Sangat', description: 'Founded by the local Sikh community' },
        history: 'Our Gurudwara has served the community for decades.',
        mission: 'To spread the teachings of Guru Granth Sahib Ji.',
        vision: 'A united community living by Sikh values.',
        timeline: [],
        photos: [],
        videos: [],
      });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    let history = await History.findOne();
    if (!history) {
      history = await History.create(req.body);
    } else {
      history = await History.findByIdAndUpdate(history._id, req.body, { new: true });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPhoto = async (req, res) => {
  try {
    const history = await History.findOne();
    const photo = { url: `/uploads/${req.file.filename}`, caption: req.body.caption || '' };
    history.photos.push(photo);
    await history.save();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removePhoto = async (req, res) => {
  try {
    const history = await History.findOne();
    history.photos = history.photos.filter((p) => p._id.toString() !== req.params.photoId);
    await history.save();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
