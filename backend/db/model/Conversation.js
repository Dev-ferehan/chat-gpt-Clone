import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    token_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, 
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;