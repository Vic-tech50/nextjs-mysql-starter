// components/AssistantChat.tsx
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { askAssistant, ChatMessage } from "@/app/actions/assistant";

export default function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      const result = await askAssistant(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
    });
  };

  return (
    <div className="max-w-lg mx-auto border rounded-lg flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isPending && <div className="text-gray-400 text-sm">Assistant is thinking...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="e.g. Create a record for John Doe, dob 1990-05-01"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          disabled={isPending}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}