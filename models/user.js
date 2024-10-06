import mongoose from "mongoose";

const UserResponseSchema = new mongoose.Schema(
  {
    answer: { type: String },
    question: { type: String },
    tags: { type: [String] }, // Use an array of strings for tags
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
); // Disable automatic creation of _id for sub-documents

const UserSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
    },
    firstname: {
      type: String,
    },
    summaries: {
      type: [{}],
      default: [{}],
    },
    stories: {
      type: {},
      default: {},
    },
    user_responses: {
      type: Map, // Use Map to allow dynamic keys (dates)
      of: [UserResponseSchema], // Each date key maps to an array of user responses
      default: {},
    },
    story: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
