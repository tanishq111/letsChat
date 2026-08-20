import { MessageCircleMore } from "lucide-react";

const Brand = ({ light = false }) => {
  return (
    <div className="inline-flex items-center gap-3" aria-label="letsChat">
      <span
        className={`grid size-10 place-items-center rounded-[8px] ${
          light ? "bg-white/15 text-white" : "bg-brand text-white"
        }`}
      >
        <MessageCircleMore className="size-5" strokeWidth={2.4} />
      </span>
      <span
        className={`font-display text-xl font-bold ${light ? "text-white" : "text-ink"}`}
      >
        lets<span className={light ? "text-sun" : "text-brand"}>Chat</span>
      </span>
    </div>
  );
};

export default Brand;