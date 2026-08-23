const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Donation = require('../models/Donation');
const Budget = require('../models/Budget');

exports.getSummary = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthIncome = await Income.aggregate([
      { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const monthExpenses = await Expense.aggregate([
      { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalDonations = await Donation.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    const budget = await Budget.findOne({ month: now.getMonth() + 1, year: now.getFullYear() });
    const totalIncome = monthIncome[0]?.total || 0;
    const totalExpense = monthExpenses[0]?.total || 0;
    const savings = Math.max(0, totalIncome - totalExpense);

    const recentIncome = await Income.find()
      .sort({ date: -1 })
      .limit(5)
      .select('amount date category');
    const recentExpenses = await Expense.find()
      .sort({ date: -1 })
      .limit(5)
      .select('amount date category');
    const recentTransactions = [
      ...recentIncome.map((i) => ({
        type: 'income',
        amount: i.amount,
        date: i.date,
        category: i.category,
      })),
      ...recentExpenses.map((e) => ({
        type: 'expense',
        amount: e.amount,
        date: e.date,
        category: e.category,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      monthIncome: totalIncome,
      monthExpenses: totalExpense,
      savings,
      balance: totalIncome - totalExpense,
      totalDonations: totalDonations[0]?.total || 0,
      donationCount: totalDonations[0]?.count || 0,
      budget: budget
        ? {
            totalBudget: budget.totalBudget,
            expectedIncome: budget.expectedIncome,
            expectedExpenses: budget.expectedExpenses,
            savingTarget: budget.savingTarget,
          }
        : null,
      remainingBudget: budget ? budget.totalBudget - totalExpense : 0,
      budgetUsedPercent: budget ? ((totalExpense / budget.totalBudget) * 100).toFixed(1) : 0,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCharts = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const monthlyIncome = await Income.aggregate([
      { $match: { date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) } } },
      { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);

    const monthlyExpense = await Expense.aggregate([
      { $match: { date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) } } },
      { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);

    const categoryExpenses = await Expense.aggregate([
      { $match: { date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const categoryIncome = await Income.aggregate([
      { $match: { date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const yearlyComparison = [];
    for (let y = year - 2; y <= year; y++) {
      const inc = await Income.aggregate([
        { $match: { date: { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59) } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const exp = await Expense.aggregate([
        { $match: { date: { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59) } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      yearlyComparison.push({
        year: y,
        income: inc[0]?.total || 0,
        expense: exp[0]?.total || 0,
        savings: Math.max(0, (inc[0]?.total || 0) - (exp[0]?.total || 0)),
      });
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomeByMonth = months.map((m, i) => {
      const found = monthlyIncome.find((item) => item._id === i + 1);
      return { month: m, amount: found?.total || 0 };
    });
    const expenseByMonth = months.map((m, i) => {
      const found = monthlyExpense.find((item) => item._id === i + 1);
      return { month: m, amount: found?.total || 0 };
    });

    res.json({
      monthlyIncome: incomeByMonth,
      monthlyExpense: expenseByMonth,
      categoryExpenses: categoryExpenses.map((c) => ({ category: c._id, amount: c.total })),
      categoryIncome: categoryIncome.map((c) => ({ category: c._id, amount: c.total })),
      yearlyComparison,
      savingsGraph: incomeByMonth.map((inc, i) => ({
        month: inc.month,
        savings: Math.max(0, inc.amount - (expenseByMonth[i]?.amount || 0)),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const { month, year } = req.params;
    const budget = await Budget.findOne({ month: parseInt(month), year: parseInt(year) });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const totalIncome = await Income.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalExpenses = await Expense.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const income = totalIncome[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;
    const remainingBalance = income - expenses;

    res.json({
      month: parseInt(month),
      year: parseInt(year),
      budget: budget
        ? {
            totalBudget: budget.totalBudget,
            expectedIncome: budget.expectedIncome,
            expectedExpenses: budget.expectedExpenses,
            savingTarget: budget.savingTarget,
          }
        : null,
      totalIncome: income,
      totalExpenses: expenses,
      remainingBalance,
      savings: remainingBalance > 0 ? remainingBalance : 0,
      deficit: remainingBalance < 0 ? Math.abs(remainingBalance) : 0,
      remainingBudget: budget ? budget.totalBudget - expenses : 0,
      budgetUsedPercent: budget ? ((expenses / budget.totalBudget) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
