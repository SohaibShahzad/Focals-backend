const express = require("express");
const router = express.Router();

const {
  getAllPortfolio,
  getSpecialPortfolio,
  addNewPortfolio,
  deletePortfolio,
  updatePortfolioById,
  parser
} = require("../controller/portfolioController");

router.get("/getAllPortfolio", getAllPortfolio);
router.get("/getSpecialPortfolio", getSpecialPortfolio);
router.post("/addNewPortfolio", parser.array("images"), addNewPortfolio);
router.delete("/deletePortfolio/:id", deletePortfolio);
router.put("/updatePortfolioById/:id", parser.array("images"), updatePortfolioById);

module.exports = router;
