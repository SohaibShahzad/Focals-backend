const express = require("express");
const router = express.Router();
const {
    sendEmail,
    getContactData,
    updateContactData,
    deleteContactData,
    addContactData,
} = require("../controller/contactController");

router.post("/sendEmail", sendEmail);
router.get("/getContactData", getContactData);
router.put("/updateContactData/:id", updateContactData);
router.delete("/deleteContactData/:id", deleteContactData);
router.post("/addContactData", addContactData);

module.exports = router;