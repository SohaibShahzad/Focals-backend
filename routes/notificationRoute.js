const express = require("express");
const router = express.Router();

const {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controller/notificationController");

router.get("/getNotificationsByUser/:userId", getNotificationsByUser);
router.put("/read/:notificationId", markNotificationAsRead);
router.put("/readAll/:userId", markAllNotificationsAsRead);

module.exports = router;
