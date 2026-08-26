import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';


export const sendMessage = async (req, res) => {
     try{
        console.log("Request Body:", req.body);
        const { conversationId, text } = req.body;
        if(!conversationId  || !text) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const conversation = await Conversation.findById(conversationId);
        if(!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        // HomeWork -> add a security thing here to check if sender/receiver is a participant of the conversation. If not then return 403 forbidden error

        const message = new Message({ conversation: conversationId, sender: req.user._id, text });
        await message.save();

        
        conversation.lastMessage = message._id;
        await conversation.save();
        res.status(201).json(message);
     }catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



// GET /api/messages/:conversationId?before=<ISO date>&limit=20
export const getMessages = async (req, res) => {
    try{
         const { conversationId } = req.params;
            const { before, limit } = req.query;

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }
            const isParticipant = conversation.participants.some(participantId => participantId.toString() === req.user._id.toString());
            if (!isParticipant) {
                return res.status(403).json({ message: "You are not a participant of this conversation" });
            }

            const filter = { conversation: conversationId };
            // load older messages : only messages created before the specified date and we wil only load limited number of messages
            if(before){
                filter.createdAt = { $lt: new Date(before) };
            }

            const messages = await Message.find(filter)    // m1,m2,m3,m4,m5,m6 
                .sort({ createdAt: -1 }) // sort by createdAt in descending order// newest messages first m6,m5,m4,m3,m2,m1
                .limit(parseInt(limit) || 3) //m6,m5,m4
                .populate("sender", "username"); // populate the sender's username

                res.status(200).json(messages.reverse()); // reverse the messages to show the oldest first// reverse again m4,m5,m6
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
   
    // res.status(200).json(messages); // This line is redundant and should be removed
}