import {useState, useEffect, useRef, createContext, useCallback, useContext} from "react";
import {connectSocket, getSocket, disconnectSocket} from "../socket/socket.js";
import {api} from "../api/axios";
export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
      const [conversations, setConversations] = useState([]);
      const [activeConversation, setActiveConversation] = useState(null);
      const [messages, setMessages] = useState([]);
      const [loadingMessages, setLoadingMessages] = useState(false);
      const [onlineUserIds,setOnlineUserIds] = useState([]);
      
      const handleDisconnect = () => {
        console.log("Socket disconnected, clearing messages...");
        setOnlineUserIds([]);
      }

      const conversationRef = useRef(null);
      useEffect(() => {
        conversationRef.current = conversations;
      }, [conversations]);

      // keep the open conversation readable inside the long-lived socket callback
      const activeConversationRef = useRef(null);
      useEffect(() => {
        activeConversationRef.current = activeConversation;
      }, [activeConversation]);

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

      // whenever the activeConversation changes, load that conversation's messages
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
        const token = localStorage.getItem("token");
        if(!token) return;
        const socket = connectSocket(token);

        const handleNewMessage = (message) => {
            const open = activeConversationRef.current;
            if(open && message.conversation === open._id) {
                setMessages((prevMessages) =>
                    prevMessages.some((m) => m._id === message._id)
                        ? prevMessages
                        : [...prevMessages, message]
                );
            }

            // for al the conversations, update the lastMessage if the new message belongs to that conversation
            const kwownConversations = conversationRef.current.some(c => c._id === message.conversation);
            if(!kwownConversations) {
                loadConversations();
                return;
            }
            // update the sidebar preview + float that chat to the top
            setConversations((prev) => {
                const idx = prev.findIndex((c) => c._id === message.conversation);
                if(idx === -1) return prev;
                const updated = { ...prev[idx], lastMessage: message };
                const rest = prev.filter((c) => c._id !== message.conversation);
                return [updated, ...rest];
            });
        };

        const handleOnlineUsersUpdate = (id) => {
        setOnlineUserIds(id); // from here we can emit something
        };

        const handleMessageDelivered = ({messageIds}) => {
                const idsSet = new Set(messageIds);
                setMessages((prevMessages) =>
                    prevMessages.map((m) =>
                        idsSet.has(m._id) && m.status === "sent" ? { ...m, status: "delivered" } : m
                    )
                );
        }

        const handleReconnect = () => {
            console.log("Socket reconnected, reloading conversations...");
            const open = activeConversationRef.current;
            if(open) {
                api.get(`/api/messages/${open._id}`)
                    .then((response) => {
                        setMessages(response.data);
                    })
                    .catch((error) => {
                        console.error("Error fetching messages after reconnect:", error);
                    });
            }
        };

        socket.on("message:new", handleNewMessage);
        socket.on("users:online", handleOnlineUsersUpdate);
        socket.on("disconnect", handleDisconnect);
        socket.on("message:delivered", handleMessageDelivered); // this is for fronted change to make double tick appea
        socket.io.on("reconnect", handleReconnect); // reconnect event is emitted by the underlying socket.io client when it successfully reconnects
    

        return () => {
            socket.off("message:new", handleNewMessage);
            socket.off("users:online", handleOnlineUsersUpdate);
            socket.off("disconnect", handleDisconnect);
            socket.off("message:delivered", handleMessageDelivered);
            disconnectSocket();
        };
      }, []);

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
            const socket = getSocket();
            if(!socket) return;
            socket.emit("message:send", {
                conversationId: activeConversation._id,
                text: text.trim(),
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
      }; 

      const isUserOnline = (userId) => {
        return onlineUserIds.includes(userId);
      };
      
      return (
          <ChatContext.Provider value={{ conversations, activeConversation, loadConversations, setActiveConversation, openConversationWith, sendMessage, messages, loadingMessages, isUserOnline ,handleMessageDelivered}}>
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