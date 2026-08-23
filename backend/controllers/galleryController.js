const Gallery = require('../models/Gallery');

exports.getGallery = async (req, res) => {
  try {
    const filter = {};
    if (req.query.all !== 'true') filter.isActive = true;
    if (req.query.album) filter.album = req.query.album;
    if (req.query.type) filter.type = req.query.type;
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlbums = async (req, res) => {
  try {
    const albums = await Gallery.distinct('album', { isActive: true });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.url = `/uploads/${req.file.filename}`;
      if (data.type === 'video') data.thumbnail = data.url;
    }
    const item = await Gallery.create(data);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.url = `/uploads/${req.file.filename}`;
    const item = await Gallery.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
