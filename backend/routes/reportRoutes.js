const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { generateReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/', protect, adminOnly, generateReport);

module.exports = router;
