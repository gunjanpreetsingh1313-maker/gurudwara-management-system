const Committee = require('../models/Committee');

exports.getCommittee = async (req, res) => {
  try {
    const members = await Committee.find({ isActive: true }).sort({ order: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = `/uploads/${req.file.filename}`;
    const member = await Committee.create(data);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = `/uploads/${req.file.filename}`;
    const member = await Committee.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    await Committee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
