const express = require("express");
const router = express.Router();

const {
    getAllSocialLinks,
    addNewSocialLink,
    // deleteSocialLink,
    updateSocialLinkById,
} = require("../controller/socialLinksController");

router.get("/getAllSocialLinks", getAllSocialLinks);
router.post("/addNewSocialLink", addNewSocialLink);
router.put("/updateSocialLinkById/:id", updateSocialLinkById);

module.exports = router;