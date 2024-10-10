import OpenAI from "openai";
import User from "../models/user.js";
import Question from '../models/question.js'; 
import Category from '../models/category.js';
import { initial_question, chat_responses } from '../prompt.js';

/**
 * Handles user responses and generates appropriate replies based on the status.
 *
 * This function captures the user's response and status from the request body.
 * It uses a switch statement to determine the action based on the status:
 * - For "END_GREET_USER", it fetches an initial question and generates a response.
 * - For "CONTINUE_CHAT", it processes the user's response with the questionAnswer function.
 *
 * @param {Object} req - The request object containing the user's response and status.
 * @param {Object} res - The response object used to send the result back to the client.
 *
 * @returns {Promise<void>} - Sends a JSON response with the result of the operation.
 *
 * @throws {Error} - Logs any errors encountered during the process and sends a 400 response.
 *
 * Author: Kanishka Perera
 */

export const responseToUser = async (req, res)  => {

    try {
        const userResponse = req.body?.userResponse; // Capture the user’s response
        const status = req.body?.status; // Capture the user’s response
        let result;

        switch (status) {
            case "END_GREET_USER":
                let question = await initialQuestion();
                result = `${JSON.parse(await chatResponse(initial_question(userResponse, question))).response}`;
                break;
            case "CONTINUE_CHAT":
                result = await questionAnswer(userResponse)
                break;
    
        } res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};

/**
 * Generates a chat response from OpenAI based on the provided prompt.
 *
 * This function initializes the OpenAI SDK with the API key, sends a 
 * chat completion request using the specified model and prompt, and 
 * returns the generated response content.
 *
 * @param {string} prompt - The prompt to send to the OpenAI chat model.
 * @returns {Promise<string>} - The generated chat response message.
 *
 * @throws {Error} - Logs any errors encountered during the OpenAI API call.
 *
 * Author: Kanishka Perera
 */

const chatResponse = async (prompt) => {
    try {

        // open ai secret key [env] declaration
        const open_ai = new OpenAI({
            apiKey: process.env.OPEN_AI_API,
        });

        // generate the response based on the prompt and user inputs
        const response =  await open_ai.chat.completions.create({
            model: process.env.MODEL,
            messages: [{role: 'user', content: prompt}],
            temperature: 0.7,
            max_tokens: 150,
        });

        // return only message
        return response.choices[0].message.content;

    } catch (error) { console.log('Error retrieving responses:', error); }
};

/**
 * Retrieves a random question from the database.
 *
 * This function fetches a list of questions, filters out any invalid 
 * entries, and selects a random question from the valid list to return.
 *
 * @returns {Promise<string>} - A randomly selected question from the 
 *                              database, or undefined if an error occurs.
 *
 * @throws {Error} - Logs any errors encountered during database access.
 *
 * Author: Kanishka Perera
 */

const initialQuestion = async () => {

    try {
        const question_list = await Question.find().select({ Question: 1, _id: 0 });
        const questions = question_list.filter(item => item && item.Question).map(item => item.Question); 

        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex];
    } catch (error) {
        console.log(error);
    }

}

/**
 * Handles user responses by processing a question and answer pair,
 * categorizing them, and saving the result to the user's document.
 *
 * This function retrieves the current date, fetches categories, 
 * processes the user response through a chat response function,
 * and updates the user's responses in the database.
 *
 * @param {Object} userResponse - The user's response object containing 
 *                                the question and answer.
 * 
 * @returns {Promise<Object>} - Returns the processed result object 
 *                              containing user response details.
 *
 * @throws {Error} - Logs and returns an error if any operation fails.
 *
 * Author: Kanishka Perera
 */

const questionAnswer = async(userResponse) => {
    try {

        const patient_id = "66a5a24db1507dbec0f15541";
        const date = new Date().toISOString().split('T')[0];

        const categories_list = await Category.find().select({ type: 1, _id: 0 });
        const category = categories_list.filter(item => item && item.type).map(item => item.type); 
        
        const result = JSON.parse(await chatResponse(chat_responses(userResponse.question, userResponse.answer, category)));

        await User.findByIdAndUpdate(
            patient_id,
            {
                $push: {
                    [`user_responses.${date}`]: {
                        answer: result.user_response, // User answer
                        question: userResponse.question, // Current question
                        tags: result.tags,
                        status: "READY_TO_PROCESS",
                        timestamp: new Date() // Current date and time
                    }
                }
            },
            { new: true } // Return the updated document
        );
        return result;
        
    } catch (error) {
        
        console.log(error);
        res.status(400).json(error);
    }
}