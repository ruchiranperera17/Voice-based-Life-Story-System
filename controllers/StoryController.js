import Response from "../models/responses.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import User from "../models/user.js";
import { build_narrative } from '../prompt.js';

dotenv.config();
   
const retrieveResponses = async (response_id) => {
    try {
        const user_responses = await Response.findById(response_id);
        return user_responses;

    } catch (error) {
        console.log('Error retrieving responses:', error);
    }
};

export const buildStorySummary = async (req, res, next) => {

    res.status(200).json("eORK");

    const response_id = "668d32cfa4b669ea0d6f7579"; // ! Replace with function (When start to generate)
    const patient_name = "Tom Cruise"; // ! patient details [Array]
    const patient_id = "668e573fee886ad68ad77a24";
    const user_response = await retrieveResponses(response_id); // retrieve all responses [Q&A]

    if (!user_response?.user_responses) {
        res.status(404).json({error: 'User response not found'});
    } 

    // Setup OpenAI SDK with API Key
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API,
    });

    try {

        const categories = ["Childhood", "School", "Career", "Family", "Hobbies", "Travel", "Milestones", "Traditions", "Holidays", "Friends"];

        const prompt = `Please summarize the story based on the following details from ${patient_name} only and find or create categorized tags using the list ${JSON.stringify(categories)}. 
        Do not add any information from external sources. Respond back with a JSON format that includes a summarized story and a suitable tag array:\n\n${JSON.stringify(user_response)}`;

        const summary = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            top_p: 1,
            });
        
        const summaryResponse = JSON.parse(summary.choices[0].message.content);
        const summarizedStory = summaryResponse.summarized_story;
        const tagArray = summaryResponse.tag_array;

        // Save the story summary in the database
        const savedSummary = saveSummary(patient_id, response_id, summarizedStory, tagArray);
        res.status(200).json(savedSummary);

    } catch (error) {
        console.log('Error retrieving responses:', error);
    }     
}


const saveSummary = async (user_id, response_id, summary_report, tags) => {
    
    try {
        const saveSummary = await User.findByIdAndUpdate(user_id, {
            $push: { 
                summaries: {
                    response_id: response_id,
                    summary: summary_report,
                    tags: tags
                }
            }
        }, {new: true});
         return saveSummary;

        } catch (error) {
        console.log('Error retrieving responses:', error);
    }
}

export const buildStoryNarratives = async (req, res, next) => {
    const response_id = "668d32cfa4b669ea0d6f7579"; // ! Replace with function (When start to generate)
    const patient_name = "Tom Cruise"; // ! patient details [Array]
    const patient_id = "668e573fee886ad68ad77a24";
    const user_response = await retrieveResponses(response_id); // retrieve all responses [Q&A]

    if (!user_response?.user_responses) {
        res.status(404).json({error: 'User response not found'});
    } 

    // Setup OpenAI SDK with API Key
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API,
    });

    try {

        const categories = ["Childhood", "School", "Career", "Family", "Hobbies", "Travel", "Milestones", "Traditions", "Holidays", "Friends"];
        
        const prompt = `Please build the story based on the following details from ${patient_name} only and find or create categories using the list ${JSON.stringify(categories)}.
        Do not add any information from external sources. Respond back with a JSON format that includes an stories array with category name and narrative story:\n\n${JSON.stringify(user_response?.user_responses)}`;
        const narratives = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            top_p: 1,
        });
        
        const storyResponse = JSON.parse(narratives.choices[0].message.content);
        
        saveStoryNarratives(patient_id, response_id, storyResponse)
        res.status(200).json(storyResponse);

    } catch (error) {
        console.log('Error retrieving responses:', error);
    }  
}

const saveStoryNarratives = async (patient_id, response_id, story) => {

    const timestamp = new Date().toISOString();
    const narrative_stories = story;
    //let saveStoryNarratives;
    try {
        for (const { category, narrative } of narrative_stories.stories) {
            
            // Update existing category if found
            let updatedUser = await User.findOneAndUpdate(
                { _id: patient_id, "stories.category": category },
                {
                    $push: { 'stories.$.history': { date: timestamp, text: narrative } }
                },
                { new: true }
            );

            // If category does not exist, add a new category entry
            if (!updatedUser) {
                updatedUser = await User.findByIdAndUpdate(
                    patient_id,
                    {
                        $push: {
                            stories: {
                                category: category,
                                latest: narrative,
                                history: [{ date: timestamp, text: narrative }]
                            }
                        }
                    },
                    { new: true }
                );
            }

            buildStoryByCategory(patient_id, category);

            
        }

    } catch (error) {
        console.log('Error retrieving responses:', error);
    }
}

const buildStoryByCategory = async (patient_id, category) => {

    
    const user = await User.findOne({ _id: patient_id, "stories.category": category });
    
    if (!user) {
                console.log('User not found');
                return;
            }
        
            // Extract history texts from the selected category
            const historyTexts = [];
            
            user.stories.forEach(story => {
                if (story.category === category) {
                    story.history.forEach(entry => {
                        if(entry.text !== null) {
                            historyTexts.push(entry.text);
                        }
                    });
                }
            });
        
            // Output all history texts for the selected category
            console.log(historyTexts);
            
            // Setup OpenAI SDK with API Key
            const openai = new OpenAI({
                apiKey: process.env.OPEN_AI_API,
            });
            
            const prompt = `Please build the storyline of the user by using provided array only.
            Do not add any information from external sources. Respond back only the story:\n\n${JSON.stringify(historyTexts)}`;
            const narratives = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                top_p: 1,
            });
            
            //const storyResponse = JSON.parse(narratives.choices[0].message.content);
            console.log(narratives.choices[0].message.content);
            const newRes = narratives.choices[0].message.content;

            let updatednew = await User.findOneAndUpdate(
                { _id: patient_id, "stories.category": category },
                {
                    $set: { 'stories.$.full_story': newRes}
                },
                { new: true }
            );
            console.log(updatednew);
        }

export const processResponses = async (req, res, next) => {

    try {

        const user_id = req.params['id']
        const user = await User.findById(req.params['id']);
  
        if (!user) {
            console.log('User not found');
            return;
        }

        let newResponses = await retireveUserResponses(user.user_responses);


        let response1 = await buildCompletedStoryLine(user_id, user, newResponses); 
        let response2 = await buildSummaries()

        if (response1['success'] && response2['success']) {

            const result_update = await updateUserResponsesStatus(user_id)
            res.status(200).json(result_update);

        }
        
        
    } catch (error) {
        
    }
}
// Story Narrative
const buildCompletedStoryLine = async(user_id, user, newResponses) => {

    let currentStory = user?.full_story? user.full_story : '';
 
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API,
    });
    const prompt = build_narrative(currentStory, newResponses);
    const narratives = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        top_p: 1,
    }); 

    const new_storyline = JSON.parse(narratives.choices[0].message.content)
    const result = await saveStory(user_id, new_storyline);
    if (result) {
        console.log('Operation successful:');
        return { success: true, data: result };
    } else {
        console.log('No document found to update.');
        return { success: false, message: 'No document found to update.' };
    }
}

const retireveUserResponses = async (User) => {
    try {
        const userResponses = User; // Extract the user_responses Map

        // Initialize an array to hold all user answers with "READY_TO_PROCESS" status
        let readyToProcessUserAnswers = [];

        // Loop through each date key in user_responses
        userResponses.forEach((responses, dateKey) => {
            // Check if responses is an array
            if (Array.isArray(responses)) {
                // Filter the responses with status "READY_TO_PROCESS" and extract the answers
                const filteredResponses = responses
                    .filter(record => record.status === "READY_TO_PROCESS")
                    .map(record => record.answer); // Only keep the answer
                
                // Concatenate the filtered answers to the result array
                readyToProcessUserAnswers = readyToProcessUserAnswers.concat(filteredResponses);
            } else {
                console.warn(`Expected responses to be an array for date ${dateKey}, but got ${typeof responses}`);
            }
        });

        // Return the final array of answers
        return readyToProcessUserAnswers; // This will be in the format ["Answer1", "Answer2"]

    } catch (error) {
        console.error(error);
    }
}

const saveStory = async (user_id, new_story) => {
    try {
        // Find the user by ID and update their full_story or create it if it doesn't exist
        const updatedStory = await User.findOneAndUpdate(
            { _id: user_id }, // Search criteria
            { 
                $set: { story: new_story.narrative },  // Set full_story
            },
            { new: true } // Return the new document and create if not exists
        );
        return updatedStory;
        
    } catch (error) {
        console.error('Error saving story:', error);
    }
}

const updateUserResponsesStatus = async (user_id) => {
    try {
        // Find the user by ID
        const user = await User.findById(user_id);

        if (!user) {
            throw new Error('User not found');
        }

        let updated = false;
        
        // Iterate over the user_responses Map
        user.user_responses.forEach((responses) => {
            // responses is an array, so we can iterate over it
            responses.forEach(record => {
                if (record.status === "READY_TO_PROCESS") {
                    record.status = "PROCEED"; // Change status to "PROCEED"
                    updated = true; // Mark that an update has been made
                }
            });
        });
        
        // Only save if an update was made
        if (updated) {
            await user.save();
            return { message: 'Status updated successfully', user };
        } else {
            return { message: 'No ststus to update' }; // Indicate no updates were necessary
        }

    } catch (error) {
        console.error('Error updating statuses:', error);
        throw error; // Re-throw the error after logging
    }
};

const buildSummaries = async (user_id, user, newResponses) => {

    // Setup OpenAI SDK with API Key
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API,
    });

    try {

        const categories = ["Childhood", "School", "Career", "Family", "Hobbies", "Travel", "Milestones", "Traditions", "Holidays", "Friends"];

         const prompt = `
        You are tasked with generating summaries for various categories based on the user's new responses and any previously saved summaries. Your summaries must accurately reflect the content provided without adding or altering any details. 
        
        Inputs:
        - Saved summaries (if any): ${savedSummaries}
        - User's new responses: ${newResponses}
        
        Guidelines:
        1. If ${savedSummaries} exists, integrate the new responses into the existing summaries. Ensure that every part of the summary comes directly from the user's input without external influence.
        2. If ${savedSummaries} is empty, create new summaries solely from the ${newResponses}. Ensure that all content is derived from the user's responses.
        3. Focus on capturing key insights, themes, or points from the responses and summarizing them clearly and concisely.
        4. Avoid incorporating irrelevant or inappropriate content from the user's responses. 
        
        Output:
        - Provide the generated summaries in the following format:
        
        {
          "summaries": {
            "category1": "<summary_for_category1>",
            "category2": "<summary_for_category2>",
            ...
          }
        }
        `;
        

        const summary = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            top_p: 1,
            });
        
        const summaryResponse = JSON.parse(summary.choices[0].message.content);
        const summarizedStory = summaryResponse.summarized_story;
        const tagArray = summaryResponse.tag_array;

        // Save the story summary in the database
        const savedSummary = saveSummary(patient_id, response_id, summarizedStory, tagArray);
        res.status(200).json(savedSummary);

    } catch (error) {
        console.log('Error retrieving responses:', error);
    }     
}