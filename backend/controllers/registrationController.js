const Event = require('../models/Event');

// POST /api/events/:id/register
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user already registered
    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    // Check capacity limit
    if (event.participants.length >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is at full capacity' });
    }

    event.participants.push(req.user._id);
    await event.save();

    res.status(200).json({ success: true, message: 'Registered for event successfully', event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/events/:id/register
exports.cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if participant is in the list
    if (!event.participants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are not registered for this event' });
    }

    // Remove user ID from participants array
    event.participants = event.participants.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    await event.save();
    res.status(200).json({ success: true, message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};