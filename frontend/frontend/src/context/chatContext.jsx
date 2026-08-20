import {useState, useEffect, createContext, useCallback, useContext} from "react";
import {api} from "../api/axios";
export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
      const [conversations, setConversations] = useState([]);
      const [activeConversation, setActiveConversation] = useState(null);
      
      const loadConversations = useCallback(async () => {
        try {
          const response = await api.get("/api/conversations");
          setConversations(response.data);
            } catch (error) {   
             }
      }, []);

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

      return (
          <ChatContext.Provider value={{ conversations, activeConversation, loadConversations, setActiveConversation, openConversationWith }}>
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