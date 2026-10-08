const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description']
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date']
    },
    location: {
      type: String,
      required: [true, 'Please provide a location']
    },
    category: {
      type: String,
      default: 'General'
    },
    capacity: {
      type: Number,
      default: 50
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema, 'events'); 