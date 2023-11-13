const Portfolio = require("../models/portfolioModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/var/www/media/portfolio-images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 11000000 }, // Adjust file size limit as needed
  fileFilter: function (req, file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

const getAllPortfolio = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({});
    // Simply pass the image URLs as they are now local URLs
    const portfolioWithImages = portfolios.map((portfolio) => ({
      ...portfolio._doc,
      images: portfolio.images,
    }));

    res.json(portfolioWithImages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching portfolios" });
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
  const { title, clientName, description, url, stars, category, isSpecial } =
    req.body;
  const parsedUrl = JSON.parse(url);
  const images = req.files.map((file) => `/portfolio-images/${file.filename}`);

  const parsedPortfolio = {
    title,
    category,
    clientName,
    description,
    url: parsedUrl,
    stars,
    images,
    isSpecial,
  };

  const newPortfolio = new Portfolio(parsedPortfolio);
  try {
    const savedPortfolio = await newPortfolio.save();
    res.status(200).json({ message: "Portfolio Saved", data: savedPortfolio });
  } catch (error) {
    next(error);
  }
};

const deletePortfolio = async (req, res, next) => {
  try {
    const portfolioId = req.params.id;
    const portfolioToDelete = await Portfolio.findById(portfolioId);

    if (!portfolioToDelete) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    portfolioToDelete.images.forEach((imageUrl) => {
      const filename = path.basename(imageUrl);
      fs.unlink(`/var/www/media/portfolio-images/${filename}`, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });

    await Portfolio.findByIdAndDelete(portfolioId);
    res.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePortfolioById = async (req, res, next) => {
  try {
    const portfolioId = req.params.id;
    const portfolioToUpdate = await Portfolio.findById(portfolioId);

    if (!portfolioToUpdate) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    const { title, clientName, description, url, stars, category, isSpecial } =
      req.body;
    const parsedUrl = JSON.parse(url);

    const existingImagesUrls = req.body.images || [];
    const toDeleteFilenames = portfolioToUpdate.images
      .filter((imageUrl) => !existingImagesUrls.includes(imageUrl))
      .map((url) => path.basename(url));

    toDeleteFilenames.forEach((filename) => {
      fs.unlink(`/var/www/media/portfolio-images/${filename}`, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });

    const newImageUrls = req.files.map((file) => `/portfolio-images/${file.filename}`);
    const updatedImages = existingImagesUrls.concat(newImageUrls);

    const updatedPortfolio = {
      title,
      category,
      clientName,
      description,
      url: parsedUrl,
      stars,
      images: updatedImages,
      isSpecial,
    };

    await Portfolio.findByIdAndUpdate(portfolioId, updatedPortfolio);
    res.status(200).json({ message: "Portfolio updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPortfolio,
  getSpecialPortfolio,
  addNewPortfolio,
  deletePortfolio,
  updatePortfolioById,
  upload,
};
