import {useState, useEffect, createContext, useCallback, useContext} from "react";
import {api} from "../api/axios";
export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
      const [conversations, setConversations] = useState([]);
      console.log("Conversations in ChatProvider:", conversations);
      const [activeConversation, setActiveConversation] = useState(null);
      console.log("Active Conversation in ChatProvider:", activeConversation);

      const [messages, setMessages] = useState([]);
      console.log("Messages in ChatProvider:", messages);

      const [loadingMessages, setLoadingMessages] = useState(false);
      
      
      const loadConversations = useCallback(async () => {
        try {
          const response = await api.get("/api/conversations");
          setConversations(response.data);
            } catch (error) {   
             }
      }, []);

      // whenever the activeConversation changes, we want to load the messages for that conversation

      useEffect(() => {
        if(!activeConversation){
           setMessages([]);
            return;
        } 

        setLoadingMessages(true);
        const fetchMessages = async () => {
            try {
                const response = await api.get(`/api/messages/${activeConversation._id}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
      }, [activeConversation]);



      useEffect(() => {
        loadConversations();
      }, [loadConversations]);

      const openConversationWith = async (userId) => {
          try{
            const { data } = await api.post("/api/conversations", { requestedUserId: userId });
            const conv = data;

            setConversations((prevConversations) => {
                const exists = prevConversations.some((c) => c._id === conv._id);
                return exists ? prevConversations : [conv, ...prevConversations];
            });

            setActiveConversation(conv);
            return conv;
          }catch (error) {
            console.error("Error opening conversation:", error);
            }
      }

    
      const sendMessage = async (text) => {
        try {
            if(!activeConversation) {
                throw new Error("No active conversation selected");
            }
            const response = await api.post("/api/messages", { conversationId: activeConversation._id, text });
            const newMessage = response.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            // trigger massgae update in the UI
            return newMessage;
        } catch (error) {
            console.error("Error sending message:", error);
        }
      };
      return (
          <ChatContext.Provider value={{ conversations, activeConversation, loadConversations, setActiveConversation, openConversationWith ,sendMessage, messages, loadingMessages  }}>
              {children}
          </ChatContext.Provider>
      );
};


export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};