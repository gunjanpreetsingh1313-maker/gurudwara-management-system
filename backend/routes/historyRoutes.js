const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getHistory, updateHistory, addPhoto, removePhoto } = require('../controllers/historyController');

const router = express.Router();

router.get('/', getHistory);
router.put('/', protect, adminOnly, updateHistory);
router.post('/photos', protect, adminOnly, upload.single('photo'), addPhoto);
router.delete('/photos/:photoId', protect, adminOnly, removePhoto);

module.exports = router;
