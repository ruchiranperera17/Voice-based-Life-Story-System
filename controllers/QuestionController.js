import Question from '../models/Question.js';

// CREATE a new question
export const createQuestion = async (req, res) => {
  try {
    // Log incoming request body
    console.log("Request body:", req.body);

    const { QuestionId, Question, Category, categoryQnsId, lastUpdated } = req.body;

    // Validate required fields
    if (!QuestionId || !Question || !Category || !categoryQnsId || !lastUpdated) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Create a new Question instance
    const newQuestion = new Question({
      QuestionId,
      Question,
      Category,
      categoryQnsId,
      lastUpdated,
    });

    // Save the new question to the database
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion); // Return the saved question
  } catch (error) {
    console.error("Error creating question:", error); // Log the actual error for debugging
    res.status(500).json({ message: "Error creating question", error: error.message });
  }
};

// READ all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions); // Return all questions
  } catch (error) {
    console.error("Error retrieving questions:", error);
    res.status(500).json({ message: 'Error retrieving questions', error: error.message });
  }
};

// READ a single question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(question); // Return the found question
  } catch (error) {
    console.error("Error retrieving question:", error);
    res.status(500).json({ message: 'Error retrieving question', error: error.message });
  }
};

// UPDATE a question by ID
export const updateQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(updatedQuestion); // Return the updated question
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: 'Error updating question', error: error.message });
  }
};

// DELETE a question by ID
export const deleteQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};
