require("dotenv").config();
const AppError = require("../utils/AppError");
const sequelize = require("../config/database");

const Category = require("../models/Category");
const User = require("../models/User");
const Note = require("../models/Note");

const getAllCategoriesService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User is not found!", 404);

  return await Category.findAll({
    where: { userId: userId },
    order: [["name", "ASC"]],
  });
};

const createCategoryService = async (request, userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User is not found!", 404);

  const newCate = await Category.create({
    name: request.name,
    iconIdentifier: request.iconIdentifier,
    userId: userId,
  });

  //Sync value from DB
  await newCate.reload();
  return newCate;
};

const updateCategoryService = async (id, request, userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User is not found!", 404);

  const category = await Category.findByPk(id);
  if (!category) throw new AppError("Category is not found", 404);

  category.name = request.name;
  category.iconIdentifier = request.iconIdentifier;

  await category.save();

  await category.reload();
  return category;
};

const deleteCategoryService = async (id, userId) => {
  const DEFAULT_CATE = "Uncategorized";

  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User is not found!", 404);

  const category = await Category.findByPk(id);
  if (!category) throw new AppError("Category is not found", 404);

  //Start transaction
  const transaction = await sequelize.transaction();

  try {
    if (category.name.toLowerCase() === DEFAULT_CATE.toLowerCase()) {
      throw new AppError(
        "Cannot delete the default category of the system!",
        409,
      );
    }

    const [defaultCategory] = await Category.findOrCreate({
      where: { name: DEFAULT_CATE, userId },
      defaults: { iconIdentifier: "", userId },
      transaction,
    });

    //Update deleted category's note category to default
    await Note.update(
      {
        categoryId: defaultCategory.id,
      },
      { where: { categoryId: id, userId }, transaction },
    );

    // Start delete
    await category.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    //Undo all
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getAllCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
