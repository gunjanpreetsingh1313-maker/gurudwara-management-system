const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Donation = require('../models/Donation');

const getDateRange = (type, startDate, endDate) => {
  const now = new Date();
  let start, end;

  switch (type) {
    case 'daily':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      break;
    case 'weekly': {
      const day = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - day);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;
    case 'yearly':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    case 'custom':
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }
  return { start, end };
};

exports.generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate, format = 'json' } = req.query;
    const { start, end } = getDateRange(type, startDate, endDate);

    const incomes = await Income.find({ date: { $gte: start, $lte: end } }).sort({ date: -1 });
    const expenses = await Expense.find({ date: { $gte: start, $lte: end } }).sort({ date: -1 });
    const donations = await Donation.find({ date: { $gte: start, $lte: end } }).sort({ date: -1 });

    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalDonations = donations.reduce((s, d) => s + d.amount, 0);

    const report = {
      period: { start, end, type },
      summary: { totalIncome, totalExpenses, balance: totalIncome - totalExpenses, totalDonations },
      incomes,
      expenses,
      donations,
    };

    if (format === 'json') return res.json(report);

    if (format === 'csv') {
      const rows = [
        ...incomes.map((i) => ({ Type: 'Income', Date: i.date, Category: i.category, Amount: i.amount, Description: i.description || '' })),
        ...expenses.map((e) => ({ Type: 'Expense', Date: e.date, Category: e.category, Amount: e.amount, Description: e.description || '' })),
      ];
      const parser = new Parser();
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename=report-${type}.csv`);
      return res.send(parser.parse(rows));
    }

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const summarySheet = workbook.addWorksheet('Summary');
      summarySheet.addRow(['Report Type', type]);
      summarySheet.addRow(['Period', `${start.toDateString()} - ${end.toDateString()}`]);
      summarySheet.addRow(['Total Income', totalIncome]);
      summarySheet.addRow(['Total Expenses', totalExpenses]);
      summarySheet.addRow(['Balance', totalIncome - totalExpenses]);

      const incomeSheet = workbook.addWorksheet('Income');
      incomeSheet.addRow(['Date', 'Category', 'Amount', 'Donor', 'Payment Mode', 'Description']);
      incomes.forEach((i) => incomeSheet.addRow([i.date, i.category, i.amount, i.donorName, i.paymentMode, i.description]));

      const expenseSheet = workbook.addWorksheet('Expenses');
      expenseSheet.addRow(['Date', 'Category', 'Amount', 'Vendor', 'Description']);
      expenses.forEach((e) => expenseSheet.addRow([e.date, e.category, e.amount, e.vendor, e.description]));

      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.header('Content-Disposition', `attachment; filename=report-${type}.xlsx`);
      await workbook.xlsx.write(res);
      return;
    }

    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.header('Content-Type', 'application/pdf');
      res.header('Content-Disposition', `attachment; filename=report-${type}.pdf`);
      doc.pipe(res);
      doc.fontSize(20).text('Gurudwara Financial Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Period: ${start.toDateString()} - ${end.toDateString()}`);
      doc.text(`Total Income: ₹${totalIncome.toLocaleString('en-IN')}`);
      doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}`);
      doc.text(`Balance: ₹${(totalIncome - totalExpenses).toLocaleString('en-IN')}`);
      doc.moveDown();
      doc.fontSize(14).text('Income Records');
      incomes.forEach((i) => doc.fontSize(10).text(`${new Date(i.date).toDateString()} - ${i.category}: ₹${i.amount}`));
      doc.moveDown();
      doc.fontSize(14).text('Expense Records');
      expenses.forEach((e) => doc.fontSize(10).text(`${new Date(e.date).toDateString()} - ${e.category}: ₹${e.amount}`));
      doc.end();
      return;
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
