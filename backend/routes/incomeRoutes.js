const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getIncome, createIncome, updateIncome, deleteIncome } = require('../controllers/incomeController');

const router = express.Router();

router.get('/', protect, adminOnly, getIncome);
router.post('/', protect, adminOnly, createIncome);
router.put('/:id', protect, adminOnly, updateIncome);
router.delete('/:id', protect, adminOnly, deleteIncome);

module.exports = router;
