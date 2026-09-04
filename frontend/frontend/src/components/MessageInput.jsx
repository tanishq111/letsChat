import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { getSocket } from "../socket/socket.js";
import { useChat } from "../context/chatContext.jsx";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { sendMessage, activeConversation } = useChat();
  const timerRef = useRef(null);
  const lastTypingTime = useRef(0);

  const handleSubmit = async (e) => {
    e.preventDefault();          
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setText("");
    stopTyping();
    try {
      await sendMessage(trimmed);
    } catch (err) {
      setText(trimmed);          
    } finally {
      setSending(false);
    }
  };

  const emitTyping = () => {
      const socket = getSocket();
      if (!socket || !activeConversation) return;
      const now = Date.now();
      const TYPING_INTERVAL = 3000; // 3 seconds
      if (now - lastTypingTime.current > TYPING_INTERVAL) {
        socket.emit("typing", { conversationId: activeConversation._id });
        lastTypingTime.current = now;
      }

      clearTimeout(timerRef.current);// if this is not here for every keystroke, the previous timeout will still trigger and emit "stopTyping" prematurely
      timerRef.current = setTimeout(() => {
        lastTypingTime.current = 0;
        socket.emit("stopTyping", { conversationId: activeConversation._id });
      }, 1500);

  };


  const stopTyping = () => {
    const socket = getSocket();
    clearTimeout(timerRef.current);
    lastTypingTime.current = 0;
    if (!socket || !activeConversation) return;
    socket.emit("stopTyping", { conversationId: activeConversation._id });
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    if(e.target.value.trim() !== "") {
      emitTyping();
    }
    else{
      stopTyping();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-center gap-3 border-t border-line bg-paper px-6 py-4 lg:px-9"
    >
      <input
        className="flex-1 rounded-[10px] border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
        value={text}
        onChange={handleChange}
        onBlur={stopTyping}
        placeholder="Type a message"
      />
      <button
        type="submit"
        disabled={!text.trim() || sending}
        className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-brand text-white disabled:opacity-50"
        aria-label="Send message"
      >
        <Send className="size-5" strokeWidth={1.9} aria-hidden="true" />
      </button>
    </form>
  );
};

export default MessageInput;