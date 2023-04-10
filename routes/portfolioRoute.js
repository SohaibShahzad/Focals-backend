const express = require("express");
const router = express.Router();

const {
  getAllPortfolio,
  getSpecialPortfolio,
  addNewPortfolio,
  deletePortfolio,
  updatePortfolioById
} = require("../controller/portfolioController");

router.get("/getAllPortfolio", getAllPortfolio);
router.get("/getSpecialPortfolio", getSpecialPortfolio);
router.post("/addNewPortfolio", addNewPortfolio);
router.delete("/deletePortfolio/:id", deletePortfolio);
router.put("/updatePortfolioById/:id", updatePortfolioById);

module.exports = router;
