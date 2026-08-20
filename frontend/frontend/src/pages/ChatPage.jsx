import Layout from "../components/Layout.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import { ChatProvider } from "../context/chatContext.jsx";

const ChatPage = () => {
  return (
    <ChatProvider>
      <Layout>
        <ChatWindow />
      </Layout>
    </ChatProvider>
  );
};

export default ChatPage;