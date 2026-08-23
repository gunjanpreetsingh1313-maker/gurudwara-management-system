const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');

const router = express.Router();

router.get('/', protect, adminOnly, getExpenses);
router.post('/', protect, adminOnly, upload.single('bill'), createExpense);
router.put('/:id', protect, adminOnly, upload.single('bill'), updateExpense);
router.delete('/:id', protect, adminOnly, deleteExpense);

module.exports = router;
