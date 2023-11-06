const Notification = require("../models/notificationModel");

const getNotificationsByUser = async (req, res, next) => {
  const userId = req.params.userId; // Assuming the user's ID will be passed as a URL parameter

  try {
    // Find all notifications for the user, sort by date in descending order (newest first)
    const notifications = await Notification.find({ user: userId })
      .sort({ date: -1 })
      .exec();

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const markNotificationAsRead = async (req, res, next) => {
  const notificationId = req.params.notificationId;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // This option will return the updated document
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

// Controller to mark all notifications as read for a user
const markAllNotificationsAsRead = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    // Update all notifications where isRead is false
    const notifications = await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true },
      { new: true } // This option will return the updated document
    );

    // If no notifications were updated, it could mean there were no unread notifications
    if (notifications.matchedCount === 0) {
      return res.status(404).json({ message: "No unread notifications found" });
    }

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

module.exports = {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
