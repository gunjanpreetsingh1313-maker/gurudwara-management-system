const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent, addGalleryImage } = require('../controllers/eventController');

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, adminOnly, upload.single('banner'), createEvent);
router.put('/:id', protect, adminOnly, upload.single('banner'), updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.post('/:id/gallery', protect, adminOnly, upload.single('image'), addGalleryImage);

module.exports = router;
