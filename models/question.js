import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    categoryQnsId: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true }); 

const Question = mongoose.model('Question', questionSchema);

export default Question;
