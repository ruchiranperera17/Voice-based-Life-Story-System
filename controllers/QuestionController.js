

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

        const randomIndex = Math.floor(Math.random() * questions.length);
        let question =  questions[randomIndex];

        res.status(200).json(question);
        
    } catch (error) {
        console.log(error);
    }
}