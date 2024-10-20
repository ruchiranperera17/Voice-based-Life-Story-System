import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  QuestionId: { type: String, required: true },
  Question: { type: String, required: true },
  Category: { type: String, required: true },
  categoryQnsId: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
