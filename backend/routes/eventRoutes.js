const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  registerForEvent,
  cancelRegistration
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware'); // Verify path to your auth middleware

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes (require valid JWT)
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

module.exports = router;