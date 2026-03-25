import { Message } from "../../types";

export function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
          isUser ? "bg-rose-100 text-rose-600" : "bg-zinc-100 text-zinc-600"
        }`}
      >
        {isUser ? "你" : "AI"}
      </div>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-rose-500 text-white rounded-tr-sm"
            : "bg-zinc-100 text-zinc-700 rounded-tl-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}