const express = require('express');
const { getSummary, getCharts, getBudget } = require('../controllers/publicFinanceController');

const router = express.Router();

router.get('/summary', getSummary);
router.get('/charts', getCharts);
router.get('/budget/:month/:year', getBudget);

module.exports = router;
