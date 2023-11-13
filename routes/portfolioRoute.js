const express = require("express");
const router = express.Router();

const {
  getAllPortfolio,
  getSpecialPortfolio,
  addNewPortfolio,
  deletePortfolio,
  updatePortfolioById,
  upload,
} = require("../controller/portfolioController");

router.get("/getAllPortfolio", getAllPortfolio);
router.get("/getSpecialPortfolio", getSpecialPortfolio);
router.post("/addNewPortfolio", upload.array("images"), addNewPortfolio);
router.delete("/deletePortfolio/:id", deletePortfolio);
router.put("/updatePortfolioById/:id", upload.array("images"), updatePortfolioById);

module.exports = router;
