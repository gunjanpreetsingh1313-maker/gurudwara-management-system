const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const Budget = require('../models/Budget');

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const todayIncome = await Income.aggregate([
      { $match: { date: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

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
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const budget = await Budget.findOne({ month: now.getMonth() + 1, year: now.getFullYear() });
    const totalIncome = monthIncome[0]?.total || 0;
    const totalExpense = monthExpenses[0]?.total || 0;
    const remainingBudget = budget ? budget.totalBudget - totalExpense : 0;
    const savings = Math.max(0, totalIncome - totalExpense);

    const upcomingEvents = await Event.find({ date: { $gte: now }, isActive: true })
      .sort({ date: 1 })
      .limit(5);

    const recentIncome = await Income.find().sort({ date: -1 }).limit(5);
    const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5);
    const recentTransactions = [
      ...recentIncome.map((i) => ({ ...i.toObject(), type: 'income' })),
      ...recentExpenses.map((e) => ({ ...e.toObject(), type: 'expense' })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      todayIncome: todayIncome[0]?.total || 0,
      monthIncome: totalIncome,
      monthExpenses: totalExpense,
      remainingBudget,
      savings,
      totalDonations: totalDonations[0]?.total || 0,
      upcomingEvents,
      recentTransactions,
      budgetUsedPercent: budget ? ((totalExpense / budget.totalBudget) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChartData = async (req, res) => {
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
