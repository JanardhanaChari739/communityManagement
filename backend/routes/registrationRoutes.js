const express = require('express');
const router = express.Router();
const { getMyRegistrations } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyRegistrations);

module.exports = router;