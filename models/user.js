import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
    },
    summaries: {
      type: [{}],
      default: [{}]
    },
    stories: {
      type: {},
      default: {}
    }
    
}, {timestamps: true});

export default mongoose.model("User", UserSchema)