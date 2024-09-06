import OpenAI from "openai";

export const responseToUser = async (req, res, next)  => {
    try {
        const userResponse = req.body?.userResponse; // Capture the user’s response
        const status = req.body?.status; // Capture the user’s response
    
        console.log(userResponse);
        console.log(status);
        console.log(req.body);
    
        let prompt; let result;
    
        switch (status) {
            case "END_GREET_USER":
                prompt = `Analyze the sentiment of the following text from the user and respond with a friendly message in a JSON object. If the sentiment is negative, provide a sympathetic message and suggest chatting about past life stories. If the sentiment is positive, respond cheerfully and invite the user to discuss their memories. Here is the user’s response: ${userResponse}. Provide your response in the following JSON format:\n\n{ "message": "<your_message>", "status": "<negative/positive>" }`;
                result = await chatResponse(prompt);
                break;
            case "ASK_FOR_SPECIFIC_QUESTION":
                prompt = `Analyze the following user response to determine if it indicates support for starting a chat. Reply with "true" if the response suggests the user is willing to start a chat, and "false" otherwise. Here is the user’s response: ${userResponse}.`;
                result = await chatResponse(prompt);
                console.log(result);
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


export const getQuestions = (req, res, next) => {

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

    try {

        console.log("Hit 1");
        const randomIndex = Math.floor(Math.random() * questions.length);
        let question =  questions[randomIndex];

        res.status(200).json(question);
        
    } catch (error) {
        console.log(error);
    }
}

export const catchAnswers = async (req, res, next) => {

    try {

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
        let question =  questions[randomIndex];

        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_API,
        });

        let answers = [];
        answers = req.body;

        console.log(answers?.answers[0]?.answer);
        const prompt = `Given the user's response: '${JSON.stringify(answers?.answers[0]?.answer)}', generate a friendly follow-up question that encourages further engagement and is relevant to the user's answer. 
        The follow-up question should be conversational, open-ended, and should invite the user to share more details or thoughts.
        If the response is vague or indicates no specific topic or requests to change the topic, instead, use the following topic to start the conversation:'${question}'
        The generated prompt should smoothly transition into the selected topic or delve deeper into the user's initial response.`;

        const followupQuestion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            top_p: 1,
            });
        
            // Send new quis
        const nextQuestion = followupQuestion.choices[0].message.content;
        console.log(nextQuestion);
        res.status(200).json(nextQuestion);
        
    } catch (error) {
        console.log(error);
    }
}

// code here