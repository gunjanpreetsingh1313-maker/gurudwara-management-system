const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const filter = req.query.upcoming === 'true' ? { date: { $gte: new Date() }, isActive: true } : {};
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.banner = `/uploads/${req.file.filename}`;
    const event = await Event.create(data);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.banner = `/uploads/${req.file.filename}`;
    const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addGalleryImage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    event.gallery.push({ url: `/uploads/${req.file.filename}`, caption: req.body.caption || '' });
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
