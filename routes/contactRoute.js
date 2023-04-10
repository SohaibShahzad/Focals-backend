const express = require("express");
const router = express.Router();
const {
    sendEmail
} = require("../controller/contactController");

router.post("/sendEmail", sendEmail);

module.exports = router;