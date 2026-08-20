import { MessageCircleMore } from "lucide-react";
import { useChat } from "../context/chatContext.jsx";
import { useAuth } from "../context/authContext.jsx";

const ChatWindow = () => {
  const { activeConversation } = useChat();
  const { user: me } = useAuth();

  if (!activeConversation) {
    return (
      <section className="flex h-full w-full flex-col bg-paper">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-canvas px-6 text-center [background-image:radial-gradient(#cbd7d0_0.8px,transparent_0.8px)] [background-size:18px_18px]">
          <div className="rise-in relative max-w-sm bg-canvas px-8 py-7">
            <div className="mx-auto grid size-16 place-items-center rounded-[8px] bg-brand text-white shadow-[8px_8px_0_#f2b557]">
              <MessageCircleMore className="size-7" strokeWidth={1.9} aria-hidden="true" />
            </div>
            <h2 className="mt-7 font-display text-2xl font-bold text-ink">
              Your next conversation starts here.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Search a username on the left to start chatting.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const other =
    activeConversation.participants.find((p) => p._id !== me.id) ||
    activeConversation.participants[0];

  return (
    <section className="flex h-full w-full flex-col bg-paper">
      <header className="flex h-20 shrink-0 items-center gap-3 border-b border-line px-7 lg:px-9">
        <div className="grid size-10 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
          {other?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-ink">{other?.username}</h1>
          <p className="mt-0.5 text-sm text-muted">{other?.email}</p>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center bg-canvas px-6 text-center">
        <p className="text-sm text-muted">
          Conversation opened. Messaging comes next class.
        </p>
      </div>
    </section>
  );
};

export default ChatWindow;