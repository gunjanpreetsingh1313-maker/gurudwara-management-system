const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getHukamnama, updateHukamnama, getAllHukamnama } = require('../controllers/hukamnamaController');

const router = express.Router();

router.get('/', getHukamnama);
router.get('/all', protect, adminOnly, getAllHukamnama);
router.post('/', protect, adminOnly, updateHukamnama);

module.exports = router;
