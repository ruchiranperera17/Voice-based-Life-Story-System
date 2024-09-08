import mongoose from 'mongoose';
import Category from '../models/category.js'; // Import the Category model

// CREATE a new category
export const createCategory = async (req, res) => {
    try {
        const { categoryQnsId, type, description } = req.body;

        const newCategory = new Category({
            categoryQnsId,
            type,
            description,
            createdAt: new Date().toISOString(),
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// READ all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
};

// READ a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error retrieving category:', error);
        res.status(500).json({ error: 'Failed to retrieve category' });
    }
};

// UPDATE a category by ID
export const updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { type, description },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// DELETE a category by ID
export const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
