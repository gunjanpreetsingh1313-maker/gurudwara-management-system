const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getCommittee, createMember, updateMember, deleteMember } = require('../controllers/committeeController');

const router = express.Router();

router.get('/', getCommittee);
router.post('/', protect, adminOnly, upload.single('photo'), createMember);
router.put('/:id', protect, adminOnly, upload.single('photo'), updateMember);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;
