const Portfolio = require("../models/portfolioModel");

const getAllPortfolio = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({});
    res.json(portfolios);
  } catch (error) {
    next(error);
  }
};

const getSpecialPortfolio = async (req, res, next) => {
  try {
    const specialPortfolio = await Portfolio.find({ isSpecial: true }).limit(5);
    res.json(specialPortfolio);
  } catch (error) {
    next(error);
  }
};

const addNewPortfolio = async (req, res, next) => {
  const { title, url, isSpecial } = req.body;
  const parsedPortfolio = {
    title,
    url,
    isSpecial,
  };
  const newPortfolio = new Portfolio(parsedPortfolio);
  try {
    const savedPortfolio = await newPortfolio.save();
    res
      .status(200)
      .json({ message: `Portfolio Saved and the obj is ${savedPortfolio}` });
  } catch (error) {
    next(error);
  }
};

const deletePortfolio = async (req, res, next) => {
  try {
    const portfolioId = req.url.toString().split("/");
    const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId[2]);
    res.json(deletedPortfolio);
  } catch (error) {
    next(error);
  }
};

const updatePortfolioById = async (req, res, next) => {
  const { title, url, isSpecial } = req.body;
  const parsedPortfolio = {
    title,
    url,
    isSpecial,
  };
  try {
    const portfolioId = req.url.toString().split("/");
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolioId[2],
      parsedPortfolio
    );
    res.json(updatedPortfolio);
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getAllPortfolio,
  getSpecialPortfolio,
  addNewPortfolio,
  deletePortfolio,
  updatePortfolioById
};
