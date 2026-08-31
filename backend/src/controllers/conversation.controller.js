import conversationModel from "../models/conversation.model.js";

//POST Request to create a new conversation or get an existing one
export const getOrCreateConversation = async (req, res) => {
     try{
        const { requestedUserId } = req.body;
        const currentUserId = req.user._id;
        console.log("Requested User ID:", requestedUserId);
        console.log("Current User ID:", currentUserId);
         
        let conversation = await conversationModel.findOne({
            participants: { $all: [currentUserId, requestedUserId] , $size: 2 }
        }).populate("participants", "-password"); // Exclude the password field from the participants
        
        if (!conversation) {
            conversation = new conversationModel({
                participants: [currentUserId, requestedUserId]
            });
            await conversation.save();

            await conversation.populate("participants", "-password"); // Exclude the password field from the participants
        }
        res.status(200).json(conversation);

     } catch (error) {
        console.error("Error in getOrCreateConversation:", error);
        res.status(500).json({ message: "Internal server error" });
     }
};

export const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const conversations = await conversationModel.find({
            participants: currentUserId
        }).populate("participants", "-password")
        .populate("lastMessage")
        .sort({ updatedAt: -1 }); // Sort by updatedAt in descending order
         // Populate the last message of the conversation
        
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error in getConversations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};