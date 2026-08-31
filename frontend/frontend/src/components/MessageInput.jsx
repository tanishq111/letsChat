import { useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "../context/chatContext.jsx";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { sendMessage } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();          
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setText("");                
    try {
      await sendMessage(trimmed);
    } catch (err) {
      setText(trimmed);          
    } finally {
      setSending(false);
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
        onChange={(e) => setText(e.target.value)}
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