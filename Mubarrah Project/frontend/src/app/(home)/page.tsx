"use client";

import { useLLM } from "@/hook/useLLM";
import React from "react";

interface Chat {
  role: "user" | "llm";
  message: string;
}

export default function Home() {
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState<Chat[]>([]);
  const llm = useLLM();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!message.trim()) return;

    setChat((chat) => [
      ...chat,
      {
        role: "user",
        message: message,
      },
    ]);
    setMessage("");

    llm.mutate(
      { prompt: message },
      {
        onSuccess: (data) => {
          setChat((chat) => [
            ...chat,
            {
              role: "llm",
              message: data.message,
            },
          ]);
        },
        onError: () => {
          setChat((chat) => [
            ...chat,
            {
              role: "llm",
              message: "Something went wrong",
            },
          ]);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans">
      <main className="flex flex-col max-w-4xl mx-auto py-10 px-4">
        {/* Chat History */}
        <section className="flex-1 overflow-y-auto mb-6 space-y-4 max-h-[70vh]">
          {chat.map(({ message, role }: Chat, index) => (
            <div
              key={index}
              className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg shadow-md whitespace-pre-wrap text-sm
                ${role === "user"
                    ? "bg-gray-300 text-black"
                    : "bg-gray-200 text-black"
                  }`}
              >
                {message}
              </div>
            </div>
          ))}
        </section>

        {/* Input */}
        <section>
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-md"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-100 text-black placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
            >
              Send
            </button>
          </form>
        </section>

        {/* New Title Section */}
        <section className="text-center mt-10">
          <h1 className="text-3xl font-semibold text-gray-700">
            Project
          </h1>
        </section>
      </main>
    </div>
  );
}
