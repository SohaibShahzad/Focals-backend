const SocialLink = require("../models/socialLinksModel");

const getAllSocialLinks = async (req, res, next) => {
  try {
    const socialLinks = await SocialLink.find({});
    res.json(socialLinks);
  } catch (error) {
    next(error);
  }
};

const addNewSocialLink = async (req, res, next) => {
  const { linkName, linkURL } = req.body;
  const parsedSocialLink = {
    linkName,
    linkURL,
  };
  const newSocialLink = await SocialLink(parsedSocialLink);
  try {
    const savedLink = await newSocialLink.save();
    res.status(200).json({
      message: `Saved and the obj is ${savedLink}`,
    });
    // res.json(newSocialLink);
  } catch (error) {
    next(error);
  }
};

const updateSocialLinkById = async (req, res, next) => {
  const { linkName, linkURL } = req.body;
  const parsedSocialLink = {
    linkName,
    linkURL,
  };
  try {
    const socialLinkId = req.params.id;
    const updatedSocialLink = await SocialLink.findByIdAndUpdate(
      socialLinkId,
      parsedSocialLink
    );
    res.json(updatedSocialLink);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSocialLinks,
  addNewSocialLink,
  updateSocialLinkById,
};
