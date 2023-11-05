const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  changes: [{
    field: {
      type: String,
      required: true
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed, // Mixed type because the value can be of any type
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
    }
  }],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProjects', // Or whatever your project model is called
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
