const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getDonations, createDonation, updateDonation, deleteDonation } = require('../controllers/donationController');

const router = express.Router();

router.get('/', protect, adminOnly, getDonations);
router.post('/', createDonation);
router.put('/:id', protect, adminOnly, updateDonation);
router.delete('/:id', protect, adminOnly, deleteDonation);

module.exports = router;
