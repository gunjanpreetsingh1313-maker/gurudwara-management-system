const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { register, login, getMe, getUsers, updateUser, deleteUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, adminOnly, getUsers);
router.put('/users/:id', protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
