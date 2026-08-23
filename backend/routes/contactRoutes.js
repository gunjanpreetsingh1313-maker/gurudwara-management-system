const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getContact, updateContact, submitFeedback, getFeedback } = require('../controllers/contactController');

const router = express.Router();

router.get('/', getContact);
router.put('/', protect, adminOnly, upload.single('qrCode'), updateContact);
router.post('/feedback', submitFeedback);
router.get('/feedback', protect, adminOnly, getFeedback);

module.exports = router;
