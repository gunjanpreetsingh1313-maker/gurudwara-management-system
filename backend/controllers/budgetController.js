const Budget = require('../models/Budget');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ year: -1, month: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const { month, year } = req.params;
    let budget = await Budget.findOne({ month: parseInt(month), year: parseInt(year) });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const incomes = await Income.find({ date: { $gte: startDate, $lte: endDate } });
    const expenses = await Expense.find({ date: { $gte: startDate, $lte: endDate } });

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBalance = totalIncome - totalExpenses;
    const savings = remainingBalance > 0 ? remainingBalance : 0;
    const deficit = remainingBalance < 0 ? Math.abs(remainingBalance) : 0;
    const remainingBudget = budget ? budget.totalBudget - totalExpenses : 0;
    const budgetUsedPercent = budget ? ((totalExpenses / budget.totalBudget) * 100).toFixed(1) : 0;

    res.json({
      budget,
      totalIncome,
      totalExpenses,
      remainingBalance,
      savings,
      deficit,
      remainingBudget,
      budgetUsedPercent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const budget = await Budget.create(req.body);
    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Budget for this month already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
