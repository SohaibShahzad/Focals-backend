const express = require("express");
const router = express.Router();

const {
  getNotficationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controller/notificationController");

router.get("/getNotificationsByUser/:userId", getNotficationsByUser);
router.put("/read/:notificationId", markNotificationAsRead);
router.put("/readAll/:userId", markAllNotificationsAsRead);

module.exports = router;
