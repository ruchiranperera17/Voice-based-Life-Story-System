import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
    response_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_responses: {
        type: {},
        of: {
          answer: {
            type: String,
            required: true
          },
          question: {
            type: String,
            required: true
          }
        }
    },
    
}, {timestamps: true});

export default mongoose.model("Response", ResponseSchema)