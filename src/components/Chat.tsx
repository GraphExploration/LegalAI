"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "ai", text: "👋 Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      const aiMessage = {
        sender: "ai",
        text: data.answer || "Sorry, I couldn’t find an answer.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error connecting to backend." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    // ⬅️ FIXED: `overflow-hidden` prevents main page scroll, `w-full` removes side gaps
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="bg-blue-600 dark:bg-blue-700 text-white p-4 flex items-center justify-center text-lg font-semibold shadow-md">
        ⚖️ LegalAI Chat Assistant
      </header>

      {/* Chat Scrollable Section */}
      {/* ⬅️ FIXED: Only this section scrolls, not entire screen */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-2xl max-w-[90%] whitespace-pre-wrap shadow-sm ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              className="prose prose-sm dark:prose-invert max-w-none"
              components={{
                table: (props) => (
                  <table
                    className="table-auto border-collapse border border-gray-400 dark:border-gray-600 my-4 w-full text-sm"
                    {...props}
                  />
                ),
                th: (props) => (
                  <th
                    className="border border-gray-400 dark:border-gray-600 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-left"
                    {...props}
                  />
                ),
                td: (props) => (
                  <td
                    className="border border-gray-400 dark:border-gray-600 px-3 py-2 align-top"
                    {...props}
                  />
                ),
                code: ({ inline, ...props }) => (
                  <code
                    className={`rounded-md font-mono ${
                      inline
                        ? "bg-gray-200 dark:bg-gray-700 px-1"
                        : "block bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto my-2"
                    }`}
                    {...props}
                  />
                ),
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 italic text-sm"
          >
            LegalAI is typing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Bar */}
      {/* ⬅️ FIXED: Stays at bottom; doesn't scroll out of view */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
}
