import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryQnsId: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
