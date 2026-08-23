const Donation = require('../models/Donation');

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
