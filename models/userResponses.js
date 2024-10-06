import mongoose from "mongoose";

const UserResponseSchema = new mongoose.Schema(
  {
    user_responses: {
      answer: {
        type: String,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("userResponses", UserResponseSchema);
