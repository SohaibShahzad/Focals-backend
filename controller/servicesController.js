const Service = require("../models/serviceModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Local storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/var/www/media/service-images");
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
  limits: { fileSize: 11000000 },
  fileFilter: function (req, file, cb) {
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

const getAllServicesWithoutImages = async (req, res, next) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: `service stuck here` });
    next(error);
  }
};

const getAllServiceTitles = async (req, res, next) => {
  try {
    const services = await Service.find({});
    const serviceTitles = services.map((service) => service.title);
    res.json(serviceTitles);
  } catch (error) {
    res.status(500).json({ message: `service stuck here` });
    next(error);
  }
};

const getTotalServicesCount = async (req, res, next) => {
  try {
    const totalServices = await Service.countDocuments({});
    res.json(totalServices);
  } catch (error) {
    res.status(500).json({ message: `service stuck here` });
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({});

    // No need to fetch thumbnails and images from Cloudinary as they are stored as URLs
    const servicesWithThumbnailsAndImages = services.map((service) => ({
      ...service._doc,
      thumbnail: service.thumbnail, // Direct URL for thumbnail
      images: service.images, // Direct URLs for images
    }));

    res.json(servicesWithThumbnailsAndImages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const services = await Service.find({});
    const categories = services.map((service) => service.category);
    const uniqueCategories = [...new Set(categories)];
    res.json(uniqueCategories);
  } catch (error) {
    res.status(500).json({ message: `service stuck here` });
    next(error);
  }
};

const getServicesTitle = async (req, res, next) => {
  try {
    const services = await Service.find({});
    const serviceTitles = services.map((service) => {
      return {
        id: service._id,
        title: service.title,
      };
    });
    res.json(serviceTitles);
  } catch (error) {
    res.status(500).json({ message: `service stuck here` });
    next(error);
  }
};

const getServiceDataAndImages = async (req, res, next) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({
      ...service._doc,
      images: service.images, // Direct URLs
      // thumbnail: service.thumbnail, // Direct URL
    });
  } catch (error) {
    next(error);
  }
};

const addNewServiceWithImages = async (req, res, next) => {
  const { title, description, url, newPackages, category } = req.body;
  const packages = JSON.parse(newPackages);
  const parsedUrl = JSON.parse(url);

  // Handling the thumbnail image
  const thumbnailImage =
    req.files.thumbnail && req.files.thumbnail.length > 0
      ? `http://31.220.62.249/service-images/${req.files.thumbnail[0].filename}`
      : null;

  // Handling multiple images
  const images = req.files.images
    ? req.files.images.map(
        (file) => `http://31.220.62.249/service-images/${file.filename}`
      )
    : [];

  const parsedService = {
    title,
    description,
    packages,
    images,
    url: parsedUrl,
    thumbnail: thumbnailImage, // URL of the thumbnail image
    category,
  };

  const newService = new Service(parsedService);
  try {
    const savedService = await newService.save();
    res
      .status(200)
      .json({ message: `Service is Successfully Saved!!`, data: savedService });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const serviceId = req.params.id; // Assuming you're passing the service ID in the URL parameters
    const serviceToDelete = await Service.findById(serviceId);

    if (!serviceToDelete) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    // Delete the service's images from local storage
    serviceToDelete.images.forEach((imageUrl) => {
      const filename = path.basename(imageUrl);
      const imagePath = `/var/www/media/service-images/${filename}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    // Delete the service's thumbnail from local storage
    if (serviceToDelete.thumbnail) {
      const thumbnailFilename = path.basename(serviceToDelete.thumbnail);
      const thumbnailPath = `/var/www/media/service-images/${thumbnailFilename}`;
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await Service.findByIdAndDelete(serviceId);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateServiceById = async (req, res, next) => {
  try {
    const serviceId = req.params.id;
    const serviceToUpdate = await Service.findById(serviceId);
    if (!serviceToUpdate) {
      return res.status(404).json({ message: "Service not found" });
    }

    const { title, description, url, newPackages, category } = req.body;
    const packages = JSON.parse(newPackages);
    const parsedUrl = JSON.parse(url);

    let thumbnail = serviceToUpdate.thumbnail;
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      // Delete old thumbnail if it exists and is different from the new one
      const oldThumbnailPath = `/var/www/media/service-images/${path.basename(
        thumbnail
      )}`;
      if (fs.existsSync(oldThumbnailPath)) {
        fs.unlinkSync(oldThumbnailPath);
      }
      thumbnail = `http://31.220.62.249/service-images/${req.files.thumbnail[0].filename}`;
    }

    let images = serviceToUpdate.images.map(
      (img) => `http://31.220.62.249/service-images/${path.basename(img)}`
    );
    if (req.files.images) {
      // Add new images to the images array
      images = [
        ...images,
        ...req.files.images.map(
          (file) => `http://31.220.62.249/service-images/${file.filename}`
        ),
      ];
    }

    const updateData = {
      title,
      description,
      packages,
      images,
      url: parsedUrl,
      thumbnail,
      category,
    };

    await Service.findByIdAndUpdate(serviceId, updateData, { new: true });
    res.status(200).json({ message: `Service updated successfully` });
  } catch (error) {
    next(error);
  }
};

const getServicesWithThumbs = async (req, res, next) => {
  try {
    const services = await Service.find(
      {},
      "title description thumbnail category"
    );

    // Map over the services to transform the thumbnail field
    const servicesWithThumbnails = services.map((service) => ({
      id: service._id,
      title: service.title,
      description: service.description,
      thumbnail: service.thumbnail, // Use the thumbnail URL directly
      category: service.category,
    }));

    res.json(servicesWithThumbnails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services with thumbnails" });
    next(error);
  }
};

module.exports = {
  getAllServices,
  getCategories,
  getTotalServicesCount,
  getAllServiceTitles,
  getAllServicesWithoutImages,
  getServiceDataAndImages,
  addNewServiceWithImages,
  deleteService,
  updateServiceById,
  getServicesTitle,
  getServicesWithThumbs,
  upload,
};
