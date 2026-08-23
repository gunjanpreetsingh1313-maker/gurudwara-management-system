const Income = require('../models/Income');

exports.getIncome = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const income = await Income.find(filter).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createIncome = async (req, res) => {
  try {
    const income = await Income.create(req.body);
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
