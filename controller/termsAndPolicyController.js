const TermsAndPolicy = require("../models/termsAndPolicyModel");

const getAllContent = async (req, res, next) => {
  try {
    const content = await TermsAndPolicy.find({});
    res.json(content);
  } catch (error) {
    next(error);
  }
};

const addNewContent = async (req, res, next) => {
  const { contentName, contentPara } = req.body;
  const parsedContent = {
    contentName,
    contentPara,
  };
  const newContent = await TermsAndPolicy(parsedContent);
  try {
    const savedContent = await newContent.save();
    res.status(200).json({
      message: `Saved and the obj is ${savedContent}`,
    });
  } catch (error) {
    next(error);
  }
}


const updateContentById = async (req, res, next) => {
    const {contentName, contentPara} = req.body
    const updateContent = {contentName, contentPara}

    try{
        const contentId = req.params.id
        const updatedContent = await TermsAndPolicy.findByIdAndUpdate(
            contentId,
            updateContent
        )
        res.json(updatedContent)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllContent,
    addNewContent,
    updateContentById
}