import mongoose from "mongoose";

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
      type: {}, // Correctly define it as an array of objects
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
