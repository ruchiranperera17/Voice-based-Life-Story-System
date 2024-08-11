import OpenAI from "openai";


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

        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_API,
        });

        let answers = [];
        answers = req.body;

        console.log(answers?.answers[0]?.answer);
        const prompt = `Given the user's response: '${JSON.stringify(answers?.answers[0]?.answer)}', generate a friendly follow-up question that encourages further engagement and is relevant to the user's answer. The follow-up question should be conversational, open-ended, and should invite the user to share more details or thoughts.`;

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