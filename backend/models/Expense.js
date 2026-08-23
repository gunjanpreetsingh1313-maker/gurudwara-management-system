const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['Langar', 'Electricity', 'Water', 'Salary', 'Cleaning', 'Building Maintenance', 'Religious Programs', 'Miscellaneous'],
      required: true,
    },
    vendor: String,
    billUpload: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
