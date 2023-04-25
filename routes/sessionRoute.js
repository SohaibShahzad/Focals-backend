const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const { getSession } = require("../controller/sessionController");

router.get("/getSession", ensureAuthenticated, getSession);

module.exports = router;
