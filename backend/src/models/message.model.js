import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
      "conversation": {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
      },

      "sender": {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      "text": {
        type: String,
        required: true
      },

        /* this will come as a part of read receipts */
      "status": {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent"
      },

      deliveredTo: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
      },

      seenBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
      },

}, {timestamps: true});


const Message = mongoose.model("Message", messageSchema);

export default Message;