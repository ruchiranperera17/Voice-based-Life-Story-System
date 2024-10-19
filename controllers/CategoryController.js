import Category from '../models/Category.js';

// CREATE a new category
export const createCategory = async (req, res) => {
  try {
    const { categoryQnsId, type, description } = req.body;
    const newCategory = new Category({ categoryQnsId, type, description });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

// READ all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}); // Ensure there's no .limit() here
    res.status(200).json(categories); // Return all categories
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories', error });
  }
};

// READ a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category', error });
  }
};

// UPDATE a category by ID
export const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

// DELETE a category by ID
export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
