import OpenAI from "openai";
import dotenv from "dotenv";
import User from "../models/user.js";
import Category from '../models/category.js';
import { build_narrative, build_summary } from '../prompt.js';

dotenv.config();

/**
 * Processes user responses to generate and save a completed storyline and summaries.
 *
 * This middleware function is triggered to handle a request for processing 
 * user responses. It retrieves the user by ID, collects categories, and 
 * fetches the user's responses. The function then builds a completed 
 * storyline and summaries based on the responses, updating the user's 
 * status if both operations are successful. Finally, it sends a JSON response 
 * with the results of the update operation.
 *
 */
export const processResponses = async (req, res, next) => {

    try {

        const user_id = req.params['id']
        const user = await User.findById(req.params['id']);

        if (!user) {
            console.error('User not found');
            return;
        }

        const categories_list = await Category.find().select({ type: 1, _id: 0 });

        let newResponses = await retrieveUserResponses(user.user_responses);

        let response1 = await buildCompletedStoryLine(user_id, user, newResponses); 
        let response2 = await buildSummaries(user_id, newResponses, categories_list);

        if (response1['success'] && response2['success']) {

            const result_update = await updateUserResponsesStatus(user_id)
            res.status(200).json(result_update);

        }
        
        
    } catch (error) {
        console.error(error);
    }
}

/**
 * Builds and saves a completed storyline based on user responses.
 *
 * This function takes the user's current story and new responses to generate
 * an enriched narrative using OpenAI's chat model. It constructs a prompt 
 * from the current story and new responses, sends the prompt to the OpenAI API, 
 * and then saves the updated storyline in the database. If the save operation 
 * is successful, it returns the updated user document; otherwise, it indicates 
 * that no document was found to update.
 *
 * @param {string} user_id - The ID of the user for whom the story is being built.
 * @param {Object} user - The user object containing the current story.
 * @param {Array} newResponses - The new responses to be incorporated into the storyline.
 *
 * @returns {Promise<Object>} - Returns an object indicating success or failure, 
 *                              along with the updated data if successful.
 */
const buildCompletedStoryLine = async(user_id, user, newResponses) => {

    let currentStory = user?.full_story? user.full_story : '';
 
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API,
    });
    const prompt = build_narrative(currentStory, newResponses);
    const narratives = await openai.chat.completions.create({
        model: process.env.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        top_p: 1,
    }); 

    const new_storyline = JSON.parse(narratives.choices[0].message.content)
    const result = await saveStory(user_id, new_storyline);
    if (result) {
        console.info('Operation successful:');
        return { success: true, data: result };
    } else {
        console.info('No document found to update.');
        return { success: false, message: 'No document found to update.' };
    }
}

/**
 * Retrieves user answers with the status "READY_TO_PROCESS".
 *
 * This function takes in a user responses Map and iterates through it to collect 
 * answers that are marked as "READY_TO_PROCESS". The function checks each date 
 * key for an array of responses, filters them based on the status, and returns 
 * an array of answers. If a date contains non-array responses, a warning will 
 * be logged to the console.
 *
 * @param {Map} User - The user responses Map containing date keys and 
 *                     corresponding response records.
 *
 * @returns {Promise<Array>} - Returns an array of answers ready for processing.
 */
const retrieveUserResponses = async (User) => {
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

/**
 * Saves or updates the user's story in the database.
 *
 * This function searches for a user by their ID and updates their `story` field 
 * with the provided `narrative`. If the user does not exist, a new story is created. 
 * The final result will return the updated user document in the following format:
 *
 * {
 *   _id: ObjectId,
 *   story: 'User narrative', // Updated or created story
 *   ...
 * }
 *
 * @param {String} user_id - The unique identifier of the user whose story 
 *                            is to be saved or updated.
 * @param {Object} new_story - An object containing the user's narrative.
 *
 * @returns {Promise<Object>} - Returns the updated user document containing 
 *                               the new story if the operation is successful.
 *
 * Author: Kanishka Perera
 */

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

/**
 * Generates and saves summaries for a user based on new responses and categories.
 * 
 * @param {String} user_id - The unique identifier of the user.
 * @param {Array} newResponses - Array of new user responses to summarize.
 * @param {Array} categories - Array of category names for structuring the summary.
 * 
 * @returns {Promise<Object>} - Returns an object indicating success or failure.
 * 
 * Author: Kanishka perera
 */
const buildSummaries = async (user_id, newResponses, categories) => {

    // Setup OpenAI SDK with API Key
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API,
    });

    try {

        const summary = await openai.chat.completions.create({
            model: process.env.model,
            messages: [{ role: "user", content: build_summary(categories, newResponses) }],
            temperature: 0.7,
            top_p: 1,
        });

        const summaryResponse = JSON.parse(summary.choices[0].message.content);
        const result = await saveSummary(user_id, summaryResponse);
        if (result) {
            console.info('Operation successful:');
            return { success: true, data: result };
        } else {
            console.info('No document found to update.');
            return { success: false, message: 'No document found to update.' };
        }

    } catch (error) {
        console.error('Error retrieving responses:', error);
    }     
}

/**
 * Updates a user's document with categorized summaries in the MongoDB database.
 * 
 * This function takes a user ID and a set of summaries grouped by category, and then dynamically
 * updates the `summaries` field in the user's document by setting each category as an object
 * with a summary and timestamp. T
 * 
 * @param {String} user_id - The unique identifier of the user whose document will be updated.
 * @param {Object} summaries - An object containing categorized summaries where each key represents
 *                             a category (e.g., 'Childhood', 'Achievements') and its corresponding value
 *                             is the summary text related to that category.
 * 
 * Example Structure of summaries parameter:
 * {
 *   summaries: {
 *     "Childhood": "Ken recalls having many friends during his childhood...",
 *     "Career": "Ken works as an associate software engineer...."
 *   }
 * }
 * 
 * @returns {Promise<Boolean>} - Returns `true` if all updates are successfully processed.
 *                               Returns `false` if an error occurs during processing.
 * 
 * Author: Kanishka Perera
 */
const saveSummary = async (user_id, summaries) => {
    
    try {

        let results = [];
        for (const [category, summary] of Object.entries(summaries.summaries)) {

            const result = await User.findByIdAndUpdate(
                user_id,
                {
                    $push: {
                        [`summaries.${category}`]: {
                            summary: summary, // Summary
                            timestamp: new Date() // Current date and time
                        }
                    }
                },
                { new: true } // Return the updated document
            );
            results.push(result);
        };

        return results;

        } catch (error) {
            
            console.error('Error retrieving responses [Summary > Store]:', error);
            return false;
    }
}

/**
 * Updates the status of user responses from "READY_TO_PROCESS" to "PROCEED".
 *
 * This function retrieves a user by their ID and checks their user responses for 
 * any records with a status of "READY_TO_PROCESS". If found, it updates the 
 * status to "PROCEED" and saves the changes to the database. 
 *
 * @param {String} user_id - The unique identifier of the user whose responses 
 *                            are to be updated.
 *
 * @returns {Promise<Object>} - Returns an object with a message indicating 
 *                               the result of the operation and the updated 
 *                               user document if any changes were made.
 *
 * Author: Kanishka Perera
 */

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

/**
 * Retrieves the story of a patient for reading aloud.
 *
 * This function extracts the patient ID from the request parameters,
 * fetches the corresponding user's story from the database,
 * and sends the story back in the response. The story is
 * selected without the _id field for privacy.
 *
 * @param {Object} req - The request object containing the patient ID.
 * @param {Object} res - The response object used to send the user's story.
 *
 * @returns {Promise<void>} - Sends a JSON response with the user's story or an error.
 *
 * @throws {Error} - Logs any errors encountered during the process and sends a 400 response.
 *
 * Author: Kanishka Perera
 */

export const readAloudStory = async(req, res) => {

    try {
        
        const patient_id = req.params['id'];
        const user = await User.findOne({ _id: patient_id}).select('story -_id');;
        res.status(200).json(user);
        
    } catch (error) {

        res.status(400).json(error);
        
    }

} 