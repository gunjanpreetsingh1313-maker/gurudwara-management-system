const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getDashboardStats, getChartData } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/charts', protect, adminOnly, getChartData);

module.exports = router;
