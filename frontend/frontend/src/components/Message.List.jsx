import { useEffect, useRef } from "react";
import { useChat } from "../context/chatContext.jsx";
import { useAuth } from "../context/authContext.jsx";



const MessageList = () => {
  const { messages, loadingMessages } = useChat();
  const { user: me } = useAuth();
  const bottomRef = useRef(null);

  // Auto-scroll to the newest message whenever the list changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loadingMessages) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted">
        Loading messages…
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted">
        No messages yet — say hello.
      </div>
    );
  }

  //HW  how you will show the double tick for the delivered message in the chat application?
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-6 lg:px-9">
      {messages.map((m) => {
        // sender may be a populated object OR a raw id — handle both
        const senderId = typeof m.sender === "object" ? m.sender?._id : m.sender;
        const mine = senderId === me.id;
        return (
          <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-[12px] px-4 py-2 text-sm leading-6 ${
                mine
                  ? "bg-brand text-white rounded-br-[3px] relative"
                  : "bg-white text-ink border border-line rounded-bl-[3px]"
              }`}
            >
              {m.text}
            </div>
          </div>
        );
      })}
      {/* invisible anchor we scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;