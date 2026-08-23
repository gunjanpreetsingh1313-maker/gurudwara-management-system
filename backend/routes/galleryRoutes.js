const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getGallery, getAlbums, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');

const router = express.Router();

router.get('/', getGallery);
router.get('/albums', getAlbums);
router.post('/', protect, adminOnly, upload.single('file'), createGalleryItem);
router.put('/:id', protect, adminOnly, upload.single('file'), updateGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
