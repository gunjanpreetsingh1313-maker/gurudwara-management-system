const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getBudgets, getBudget, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

const router = express.Router();

router.get('/', protect, adminOnly, getBudgets);
router.get('/:month/:year', protect, adminOnly, getBudget);
router.post('/', protect, adminOnly, createBudget);
router.put('/:id', protect, adminOnly, updateBudget);
router.delete('/:id', protect, adminOnly, deleteBudget);

module.exports = router;
