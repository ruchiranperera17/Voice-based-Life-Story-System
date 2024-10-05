export const initial_question = (userResponse, init_question) => {
    let prompt = `Given the user’s response and the corresponding question, generate a friendly and sentimental response that includes a welcoming phrase.
        1. Input: User Response: ${userResponse}, Question: ${init_question}
        2. Sentiment Analysis: Determine the sentiment of the user response (positive or negative).
        3. Response Construction:
        - If the sentiment is negative, craft a comforting message.
        - If the sentiment is positive, craft a cheerful message.
        4. Welcoming Phrase: Create a welcoming phrase that smoothly transitions from the sentiment-based response to the specific question, ensuring it connects with the question contextually (e.g., “Let’s talk about your school” if the question is about school memories).
        5. Output Format: Provide the response in JSON format with only the response message without the given question. Do not include ${init_question}.
    `
    return prompt;
};

export const chat_responses = (Question, Answer, Categories) => {
    return `
        Given the user's response: '${Answer}' for the question: '${Question}', generate a friendly response with a follow-up question. 
        Analyze the entire answer and check for cues indicating whether the user wants to end the conversation. If the user expresses tiredness or requests to talk later (e.g., "Can we talk later?", "I'm tired", "Goodbye"), acknowledge their request and let them know they can return later.
        Additionally, categorize the user's answers using ${Categories}.

        Provide the response in the following JSON format:

        {
            "reply_message": "<generated_followup_question_or_response>",
            "status": "<one_of: continue_topic | stop_chatting>",
            "tags": "<category list>"
        }
    `
}

export const build_narrative = (currentStory, newResponses) => {
    return `
        You are provided with a user's new responses and any previously saved story. Your task is to generate a coherent and engaging narrative using only the content provided by the user response. Under no circumstances should you add, alter, or incorporate any external data—your response must strictly reflect the user's words and details. Additionally, you should identify and exclude any content that does not contribute meaningfully to the narrative, such as statements about wanting to end the conversation or unrelated comments.
        
        Inputs:
        - Saved story (if any): ${currentStory}
        - User's new responses: ${newResponses}
        
        Guidelines:
        1. If ${currentStory} is not empty, you must integrate the ${newResponses} into the existing narrative strictly using the user's exact words and details. **Do not add any additional context, descriptions, or fictional elements.** 
        2. If ${currentStory} is empty, construct a new story solely from the ${newResponses}. **Ensure that every part of the narrative comes directly from the user's input without any external influence.**
        3. The final narrative should flow logically but must be purely derived from the user's responses, with no room for external creativity or interpretation.
        4. Identify and exclude any inappropriate content that does not add to the narrative, such as requests to pause or end the conversation.
        
        Output:
        - Provide the generated narrative based on the given information in the following format:
        
        {
        "narrative": "<generated_narrative>"
        }
    `
}
  
  