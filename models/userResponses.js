import mongoose from "mongoose";

const UserResponseSchema = new mongoose.Schema(
  {
    user_responses: {
      type: {},
      of: {
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
  },
  { timestamps: true }
);

export default mongoose.model("users", UserResponseSchema);
