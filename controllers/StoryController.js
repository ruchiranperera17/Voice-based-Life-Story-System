import Response from "../models/responses.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import User from "../models/user.js";

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

export const buildCompletedStoryLine = async(req, res, next) => {


    const user = await User.findOne(req.params._id);

            if (!user) {
                console.log('User not found');
                return;
            }
        
            //res.status(200).json(user);
            // Extract history texts from the selected category
            const historyTexts = [];
        
            user.stories.forEach(story => {
                if(story.full_story !== null) {
                    historyTexts.push(story.full_story);
                }
            });
        
            // Output all history texts for the selected category
           

                // Setup OpenAI SDK with API Key
            const openai = new OpenAI({
                apiKey: process.env.OPEN_AI_API,
            });

            const prompt = `Please build the complete story of ${req.body.name} by using provided details in array only.
            Do not add any information from external sources. Respond back only the single completed story:\n\n${JSON.stringify(historyTexts)}`;
            const narratives = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                top_p: 1,
                });
            
            //const storyResponse = JSON.parse(narratives.choices[0].message.content);
            console.log(narratives.choices[0].message.content);
            res.status(200).json(narratives.choices[0].message.content);/*
            const newRes = narratives.choices[0].message.content;

            let updatednew = await User.findOneAndUpdate(
                { _id: patient_id, "stories.category": category },
                {
                    $set: { 'stories.$.full_story': newRes}
                },
                { new: true }
            );
            console.log(updatednew);*/
}