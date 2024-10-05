import OpenAI from "openai";
import User from "../models/user.js";
import Question from '../models/question.js'; 
import Category from '../models/category.js';
import { initial_question, chat_responses } from '../prompt.js';

// ! KANISHKA
export const responseToUser = async (req, res)  => {

    try {
        const userResponse = req.body?.userResponse; // Capture the user’s response
        const status = req.body?.status; // Capture the user’s response
        let result;

        switch (status) {
            case "END_GREET_USER":
                let question = await initialQuestion();
                result = `${JSON.parse(await chatResponse(initial_question(userResponse, question))).response} ${question}`;
                break;
            case "CONTINUE_CHAT":
                result = await questionAnswer(userResponse)
                break;
    
        } res.status(200).json(result);

    } catch (error) {
        res.status(400).json(error);
    }
};

const chatResponse = async (prompt) => {
    try {

        // open ai secret key [env] declaration
        const open_ai = new OpenAI({
            apiKey: process.env.OPEN_AI_API,
        });

        // generate the response based on the prompt and user inputs
        const response =  await open_ai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{role: 'user', content: prompt}],
            temperature: 0.7,
            max_tokens: 500,
        });

        // return only message
        return response.choices[0].message.content;

    } catch (error) { console.log('Error retrieving responses:', error); }
};

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
                        answer: userResponse.answer, // User answer
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