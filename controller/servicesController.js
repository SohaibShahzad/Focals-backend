const Service = require("../models/serviceModel");

const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: `service stuck here` });
    next(error);
  }
};

const getAllServiceIds = async (req, res, next) => {
  try {
    const servicesIds = await Service.find({}, {_id:1});
    res.json(servicesIds);
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) =>{
 try{
  const serviceid = req.url.toString().split('/');
  const serviceById = await Service.findById(serviceid[2]);
  res.json(serviceById);
 }catch(error){
  next(error)
 }
}

const addNewService = async (req, res, next) => {
  const { title, description, newPackages } = req.body;
  const packages = JSON.parse(newPackages);
  const parsedService = {
    title,
    description,
    packages,
  };
  const newService = new Service(parsedService);
  try {
    const savedService = await newService.save();
    res
      .status(200)
      .json({ message: `Service is Successfully Saved!!` });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const serviceid = req.url.toString().split('/');
    const deletedService = await Service.findByIdAndDelete(serviceid[2]);
    res.json(deletedService);
  } catch (error) {
    next(error);
  }
}

const updateServiceById = async (req, res, next) => {
  const { title, description, newPackages } = req.body;
  const packages = JSON.parse(newPackages);
  const newPackage = {
    title,
    description,
    packages,
  }
  try {
    const serviceid = req.url.toString().split('/');
    const updatedService = await Service.findByIdAndUpdate(serviceid[2], newPackage);
    res.json(updatedService);
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getAllServices,
  getAllServiceIds,
  getServiceById,
  addNewService,
  deleteService,
  updateServiceById
};
