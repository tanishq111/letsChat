import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import api from "../api/axios.js";
import { useChat } from "../context/chatContext.jsx";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openConversationWith } = useChat();

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/api/search/search", { params: { query: q } });
        setResults(data ? [data] : []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handlePick = async (userId) => {
    await openConversationWith(userId);
    setQuery("");     // clear the box
    setResults([]);   // close the dropdown
  };

  return (
    <div className="relative px-5 py-4">
      <div className="flex items-center gap-2 rounded-[8px] bg-white/10 px-3 py-2">
        <Search className="size-4 text-white/50" strokeWidth={2} aria-hidden="true" />
        <input
          className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people by username"
        />
        {loading && <Loader2 className="size-4 animate-spin text-white/50" aria-hidden="true" />}
      </div>

      {results.length > 0 && (
        <ul className="mt-2 space-y-1">
          {results.map((u) => (
            <li key={u._id}>
              <button
                type="button"
                onClick={() => handlePick(u._id)}
                className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left hover:bg-white/10"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sun font-display text-xs font-bold text-ink">
                  {u.username?.[0]?.toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">{u.username}</span>
                  <span className="block truncate text-xs text-white/50">{u.email}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;