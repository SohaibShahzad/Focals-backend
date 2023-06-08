const Portfolio = require("../models/portfolioModel");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio",
    format: async (req, file) => {
      // Get the file extension
      const fileExtension = path.extname(file.originalname).toLowerCase();

      // Check if the extension is allowed and return the format
      if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
        return "jpg";
      } else if (fileExtension === ".png") {
        return "png";
      } else {
        throw new Error("Unsupported file format");
      }
    },
    public_id: (req, file) => {
      // Remove file extension and add a unique identifier to the public ID
      const uniqueID = Date.now();
      return `portfolio/${path.parse(file.originalname).name}_${uniqueID}`;
    },
  },
});

const parser = multer({ storage: storage });

const getAllPortfolio = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({});
    const portfolioWithImages = await Promise.all(
      portfolios.map(async (portfolio) => {
        try {
          const fetchedImages = await Promise.all(
            portfolio.images.map(async (publicId) => {
              try {
                return await cloudinary.api.resource(publicId, {
                  resource_type: "image",
                });
              } catch (error) {
                console.error(
                  `Error fetching image with public ID ${publicId}:`,
                  error
                );
                return null;
              }
            })
          );

          const validImagesData = fetchedImages.filter(
            (image) => image !== null
          );

          return {
            ...portfolio._doc,
            images: validImagesData.map((image) => image.secure_url),
          };
        } catch (error) {
          console.error(
            `Error fetching thumbnail with public ID ${service.thumbnail}:`,
            error
          );
          return service;
        }
      })
    );

    res.json(portfolioWithImages);
  } catch (error) {
    res.status(500).json({ message: `service stuck here` });
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
  const { title, clientName, description, url, stars, category, isSpecial } = req.body;
  const parsedUrl = JSON.parse(url);
  const images = req.files.map((file) => file.filename);

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
    res
      .status(200)
      .json({ message: `Portfolio Saved and the obj is ${savedPortfolio}` });
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

    const deletePromises = portfolioToDelete.images.map((publicId) => {
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(deletePromises);
    const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId);
    res.json(deletedPortfolio);
  } catch (error) {
    next(error);
  }
};

const getPublicIdFromUrl = (url) => {
  let splitUrl = url.split("/");
  // Remove the version part
  splitUrl = splitUrl.filter((item) => !item.startsWith("v"));
  // Remove the first 6 parts: ['', 'res.cloudinary.com', 'dgg6yikgk', 'image', 'upload']
  splitUrl = splitUrl.slice(6);

  // Remove file extension from the last part
  let lastPart = splitUrl[splitUrl.length - 1];
  splitUrl[splitUrl.length - 1] = lastPart.split(".")[0];

  return splitUrl.join("/");
};

const updatePortfolioById = async (req, res, next) => {
  try {
    const portfolioId = req.params.id;
    const portfolioToUpdate = await Portfolio.findById(portfolioId);

    if (!portfolioToUpdate) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    const { title, clientName, description, url, stars, category, isSpecial } = req.body;
    const parsedUrl = JSON.parse(url);

    const existingImagesPublicIds = (req.body.images || []).map(
      getPublicIdFromUrl
    );

    const toDeletePublicIds = portfolioToUpdate.images.filter(
      (image) => !existingImagesPublicIds.includes(image)
    );

    let deletePromises = toDeletePublicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );
    await Promise.all(deletePromises);

    let images = existingImagesPublicIds;
    if (req.files) {
      images = [...images, ...req.files.map((file) => file.filename)];
    }

    const updatedPortfolio = {
      title,
      category,
      clientName,
      description,
      url: parsedUrl,
      stars,
      images,
      isSpecial,
    };

    await Portfolio.findByIdAndUpdate(portfolioId, updatedPortfolio);
    res.status(200).json({ message: "Portfolio updated successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePortfolioById_old = async (req, res, next) => {
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
  updatePortfolioById,
  parser,
};
