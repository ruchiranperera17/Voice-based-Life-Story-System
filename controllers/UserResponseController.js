import dotenv from 'dotenv';
import OpenAI from "openai";
import User from "../models/user.js";

// ! KANISHKA
export const responseToUser = async (req, res, next)  => {

    try {
        const userResponse = req.body?.userResponse; // Capture the user’s response
        const status = req.body?.status; // Capture the user’s response
        let prompt; let result;
    
        switch (status) {
            case "END_GREET_USER":
                prompt = `Analyze the sentiment of the following text from the user and respond with a friendly message in a JSON object. If the sentiment is negative, provide a sympathetic message and suggest chatting about past life stories. If the sentiment is positive, respond cheerfully and invite the user to discuss their memories. Here is the user’s response: ${userResponse}. Provide your response in the following JSON format:\n\n{ "message": "<your_message>", "status": "<negative/positive>" }`;
                result = await chatResponse(prompt);
                break;
            case "ASK_FOR_SPECIFIC_QUESTION":
                prompt = `Analyze the following user response to determine if it indicates support for starting a chat. Reply with "true" if the response suggests the user is willing to start a chat, and "false" otherwise. Here is the user’s response: ${"I " + userResponse}.`;
                const state = await chatResponse(prompt);
                if (state.toLowerCase() === 'true') {
                    result = {
                        "message": await initialQuestion(),
                        "status": "CONTINUE_CHAT"
                    }
                } else {
                    result = {
                        "message": "That's okay! If there's anything else you'd like to talk about or if you change your mind, I'm here to chat.",
                        "status": "END"
                    }
                }
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
            max_tokens: 50,
        });

        // return only message
        return response.choices[0].message.content;

    } catch (error) { console.log('Error retrieving responses:', error); }
};

const initialQuestion = async () => {

    // TODO: SETUP SAMPLE QUESTION LIST ACCORDING TO THE FOLLOWING FORMAT ////////////////////////////
    const questions = [
        "Can you tell me more about your painting hobbies?",
        "What kind of landscapes and portraits did you enjoy creating?",
        "How often did you practice playing the piano?",
        "What inspired you to start painting and playing the piano?",
        "Can you describe a memorable painting or piano piece you worked on?",
        "Did you have any favorite subjects or themes when painting?",
        "How did your daily piano practice influence your skills?",
        "Were there any particular challenges you faced while painting or playing the piano?",
        "What did you enjoy most about painting and playing the piano?",
        "Did you share your artwork or piano performances with others?"
    ];

    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

const questionAnswer = async(userResponse) => {
    try {

        const patient_id = "66a5a24db1507dbec0f15541";
        const date = new Date().toISOString().split('T')[0];
        
        await User.findByIdAndUpdate(
            patient_id,
            {
                $push: {
                    [`user_responses.${date}`]: {
                        answer: userResponse.answer, // User answer
                        question: userResponse.question, // Current question
                        timestamp: new Date() // Current date and time
                    }
                }
            },
            { new: true } // Return the updated document
        );

        const prompt = `Given the user's response: '${userResponse.answer}' for the question: '${userResponse.question}', generate a friendly follow-up question or response. 
        - If the user’s response indicates a desire to continue the current topic, generate a conversational, open-ended question related to their answer.
        - If the response is vague, off-topic, or indicates a desire to change the topic, suggest a new question or topic to discuss.
        - If the response indicates that the user wants to end the conversation, acknowledge their request and let them know they can return later.
        
        Provide the response in the following JSON format:
        
        {
          "reply_message": "<generated_followup_question_or_response>",
          "status": "<one_of: continue_topic | change_topic | stop_chatting>"
        }`;
        
        return JSON.parse(await chatResponse(prompt));
        
    } catch (error) {
        res.status(400).json(error);
    }
}