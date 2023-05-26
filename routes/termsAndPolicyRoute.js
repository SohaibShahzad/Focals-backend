const express = require("express")
const router = express.Router();

const {
    getAllContent,
    addNewContent,
    updateContentById
} = require("../controller/termsAndPolicyController")

router.get("/getAllContent", getAllContent);
router.post("/addNewContent", addNewContent);
router.put("/updateContentById/:id", updateContentById);

module.exports = router