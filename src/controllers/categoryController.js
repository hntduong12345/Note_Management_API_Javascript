const categoryService = require("../services/categoryService");

const getAllCategories = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = await categoryService.getAllCategoriesService(userId);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = await categoryService.createCategoryService(req.body, userId);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const id = req.params.id;
    const data = await categoryService.updateCategoryService(
      id,
      req.body,
      userId,
    );
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const id = req.params.id;
    const data = await categoryService.deleteCategoryService(id, userId);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
