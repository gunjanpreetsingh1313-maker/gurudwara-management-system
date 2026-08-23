const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', protect, adminOnly, createAnnouncement);
router.put('/:id', protect, adminOnly, updateAnnouncement);
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

module.exports = router;
