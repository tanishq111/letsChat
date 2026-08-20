import { LogOut, MessageCircleDashed } from "lucide-react";
import Brand from "./Brand.jsx";
import { useChat } from "../context/chatContext.jsx";
import { useAuth } from "../context/authContext.jsx";
import SearchBar from "./SearchBar.jsx";

const Sidebar = ({ user, onLogout }) => {
  const initial = user?.username?.[0]?.toUpperCase() || "?";
  const { conversations, activeConversation, setActiveConversation } = useChat();
  const { user: me } = useAuth();

  // In a 1-to-1 chat, "the other person" is the participant who isn't me
  const otherOf = (convo) =>
    convo.participants.find((p) => p._id !== me.id) || convo.participants[0];

  return (
    <aside className="flex h-svh w-full shrink-0 flex-col bg-[#172522] text-white md:w-[21rem] md:border-r md:border-white/10">
      <header className="flex h-20 shrink-0 items-center border-b border-white/10 px-5">
        <Brand light />
      </header>

      <SearchBar />

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white/55 uppercase">Conversations</h2>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/60">
            {conversations.length}
          </span>
        </div>

        {conversations.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
            <div className="grid size-14 place-items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-sun">
              <MessageCircleDashed className="size-6" strokeWidth={1.7} aria-hidden="true" />
            </div>
            <p className="mt-5 font-display text-base font-semibold text-white">
              No conversations yet
            </p>
            <p className="mt-1 text-xs text-white/50">Search a username to start one.</p>
          </div>
        ) : (
          <ul className="mt-3 space-y-1 overflow-y-auto">
            {conversations.map((convo) => {
              const other = otherOf(convo);
              const isActive = activeConversation?._id === convo._id;
              return (
                <li key={convo._id}>
                  <button
                    type="button"
                    onClick={() => setActiveConversation(convo)}
                    className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left hover:bg-white/10 ${
                      isActive ? "bg-white/10" : ""
                    }`}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun font-display text-sm font-bold text-ink">
                      {other?.username?.[0]?.toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">
                        {other?.username}
                      </span>
                      <span className="block truncate text-xs text-white/50">
                        {convo.lastMessage?.text || "No messages yet"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <footer className="flex shrink-0 items-center gap-3 border-t border-white/10 px-5 py-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-sun font-display text-sm font-bold text-ink">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{user?.username || "Account"}</p>
          <p className="truncate text-xs text-white/50">{user?.email || "Signed in"}</p>
        </div>
        <button
          className="grid size-10 shrink-0 place-items-center rounded-[8px] text-white/60 hover:bg-white/10 hover:text-white"
          type="button"
          onClick={onLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;

