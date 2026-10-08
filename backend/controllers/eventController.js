const Event = require('../models/Event');

// @desc    Get all events (sorted by upcoming date)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .populate('participants', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message
    });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('participants', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event details',
      error: error.message
    });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Protected
exports.createEvent = async (req, res) => {
  try {
    // 1. Resolve organizer ID from JWT auth middleware or fallback payload
    const organizerId = req.user?._id || req.user?.id || req.body.organizer;

    if (!organizerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Organizer ID is required to create an event. Please log in.'
      });
    }

    // 2. Format capacity and date cleanly
    const eventData = {
      ...req.body,
      capacity: Number(req.body.capacity) || 10,
      organizer: organizerId
    };

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();

    // Populate organizer details for immediate frontend rendering
    await savedEvent.populate('organizer', 'name email');

    res.status(201).json({
      success: true,
      data: savedEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
// @access  Protected (Organizer only)
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const currentUserId = req.user?._id || req.user?.id || req.body.organizer;

    // Check ownership
    if (event.organizer && currentUserId) {
      const organizerId = typeof event.organizer === 'object' ? event.organizer._id : event.organizer;
      if (organizerId.toString() !== currentUserId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to update this event.'
        });
      }
    }

    // Ensure capacity stays numeric if updated
    const updateData = { ...req.body };
    if (updateData.capacity) {
      updateData.capacity = Number(updateData.capacity);
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('organizer', 'name email');

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Protected (Organizer only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const currentUserId = req.user?._id || req.user?.id || req.body.organizer;

    // Check ownership
    if (event.organizer && currentUserId) {
      const organizerId = typeof event.organizer === 'object' ? event.organizer._id : event.organizer;
      if (organizerId.toString() !== currentUserId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to delete this event.'
        });
      }
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};


exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?._id || req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to register.'
      });
    }

    // 1. Read event to check capacity and existing participation
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    const participants = event.participants || [];

    // 2. Check if already registered
    const isRegistered = participants.some((p) => {
      const pId = typeof p === 'object' && p !== null && p._id ? p._id.toString() : p.toString();
      return pId === userId.toString();
    });

    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.'
      });
    }

    // 3. Check capacity limit
    if (event.capacity && participants.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'This event is at full capacity.'
      });
    }

    // 4. ATOMIC UPDATE: Avoids calling event.save() which triggers full schema validation
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { participants: userId } },
      { new: true, runValidators: false } // 👈 runValidators: false prevents legacy organizer errors
    )
      .populate('organizer', 'name email')
      .populate('participants', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for event!',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};


exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?._id || req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in.'
      });
    }

    // ATOMIC REMOVAL
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { participants: userId } },
      { new: true, runValidators: false }
    )
      .populate('organizer', 'name email')
      .populate('participants', 'name email');

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully.',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
      error: error.message
    });
  }
};


exports.getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json(event.participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendees',
      error: error.message
    });
  }
};