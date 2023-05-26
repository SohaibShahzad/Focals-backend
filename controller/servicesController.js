const Service = require("../models/serviceModel");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "services",
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
      return `services/${path.parse(file.originalname).name}_${uniqueID}`;
    },
  },
});

const parser = multer({ storage: storage });

const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({});

    // Fetch the thumbnail URLs from Cloudinary
    const servicesWithThumbnails = await Promise.all(
      services.map(async (service) => {
        try {
          const thumbnailData = await cloudinary.api.resource(
            service.thumbnail,
            {
              resource_type: "image",
            }
          );

          const fetchedImages = await Promise.all(
            service.images.map(async (publicId) => {
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
            (imageUrl) => imageUrl !== null
          );

          // Return the service data with the fetched thumbnail URL
          return {
            ...service._doc,
            thumbnail: thumbnailData.secure_url,
            images: validImagesData.map((imageData) => imageData.secure_url),
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

    res.json(servicesWithThumbnails);
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
      res.status(404).json({ message: "Service not found" });
      return;
    }

    const fetchedImages = await Promise.all(
      service.images.map(async (publicId) => {
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

    console.log("in here 2");
    const serviceDataWithImages = {
      ...service._doc,
      images: fetchedImages
        .filter((img) => img !== null)
        .map((img) => img.secure_url),
    };
    console.log("in here 3");
    console.log(serviceDataWithImages);

    res.json(serviceDataWithImages);
  } catch (error) {
    next(error);
  }
};

const addNewServiceWithImages = async (req, res, next) => {
  const { title, description, newPackages } = req.body;
  const packages = JSON.parse(newPackages);

  const thumbnailImage =
    req.files.thumbnail.length > 0 ? req.files.thumbnail[0] : undefined;
  const images = req.files.images.map((file) => file.filename);

  const parsedService = {
    title,
    description,
    packages,
    images,
    thumbnail: thumbnailImage.filename,
  };

  const newService = new Service(parsedService);
  try {
    const savedService = await newService.save();
    res.status(200).json({ message: `Service is Successfully Saved!!` });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const serviceid = req.url.toString().split("/");
    const serviceToDelete = await Service.findById(serviceid[2]);

    if (!serviceToDelete) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    // Delete the service's images from Cloudinary
    const deletePromises = serviceToDelete.images.map((publicId) => {
      return cloudinary.uploader.destroy(publicId);
    });

    // Delete the service's thumbnail from Cloudinary
    if (serviceToDelete.thumbnail) {
      deletePromises.push(
        cloudinary.uploader.destroy(serviceToDelete.thumbnail)
      );
    }

    await Promise.all(deletePromises);

    const deletedService = await Service.findByIdAndDelete(serviceid[2]);

    res.json(deletedService);
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

    const { title, description, newPackages } = req.body;
    const packages = JSON.parse(newPackages);

    let thumbnail = serviceToUpdate.thumbnail;
    if (req.files.thumbnail) {
      if (req.files.thumbnail[0].filename !== serviceToUpdate.thumbnail) {
        await cloudinary.uploader.destroy(serviceToUpdate.thumbnail);
      }
      thumbnail = req.files.thumbnail[0].filename;
    }
    
    let deletePromises = [];

    let images = serviceToUpdate.images;
    console.log(JSON.stringify(req.files.images.map((file) => file.filename)));
    if (req.files.images) {
      if (
        JSON.stringify(req.files.images.map((file) => file.filename)) !==
        JSON.stringify(serviceToUpdate.images)
      ) {
        deletePromises.push(
          serviceToUpdate.images.map((publicId) =>
            cloudinary.uploader.destroy(publicId)
          )
        );
      }
      images = req.files.images.map((file) => file.filename);
    }

    await Promise.all(deletePromises);

    const updateData = {
      title,
      description,
      packages,
      images,
      thumbnail,
    };

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updateData
    );

    res.json(updatedService);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceDataAndImages,
  addNewServiceWithImages,
  deleteService,
  updateServiceById,
  parser,
};
