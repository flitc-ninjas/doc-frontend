// src/components/AgentBox.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AgentBoxProps = {
  documentId: string;
  documentContent: string;
  documentTitle: string;
  policies: string;
  onApply: (newContent: string) => void;
};

export default function AgentBox({
  documentId,
  documentContent,
  documentTitle,
  policies,
  onApply,
}: AgentBoxProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`chat-history-${documentId}`);
    if (saved) return JSON.parse(saved);

    const initialMessage = {
      role: "assistant",
      content: `مرحبًا بك! 👋 كيف يمكنني مساعدتك اليوم في إنشاء أو تعديل المستند «${documentTitle || "المستند الحالي"}»؟`,
    };
    return [initialMessage];
  });

  const [isRunning, setIsRunning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  useEffect(() => {
    const saved = localStorage.getItem(`chat-history-${documentId}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [documentId]);

  useEffect(() => {
    localStorage.setItem(`chat-history-${documentId}`, JSON.stringify(messages));
  }, [messages, documentId]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsRunning(true);

    try {
      const response = await fetch("http://127.0.0.1:8001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          rules: policies || "",
          document: documentContent || "",
          document_title: documentTitle || "",
        }),
      });

      const data = await response.json();
      if (data.document_update) onApply(data.document_update);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "لم يتم استلام رد." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ حدث خطأ أثناء الاتصال بالخادم." },
      ]);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h3
        style={{
          margin: "0 0 4px 0",
          padding: 0,
          fontSize: "16px",
          fontWeight: "600",
          color: "#2563eb",
          textAlign: "center",
        }}
      >
        Agent Chat
      </h3>

      {/* منطقة المحادثة */}
      <div
        style={{
          flex: "1 1 auto",
          overflowY: "auto",
          maxHeight: "700px",
          background: "#f9fafb",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          padding: "10px",
          color: "#1e293b",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          scrollBehavior: "smooth",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",

        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#2563eb" : "#e2e8f0",
              color: m.role === "user" ? "white" : "#1e293b",
              borderRadius: "10px",
              padding: "8px 12px",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
              boxShadow:
                m.role === "assistant"
                  ? "0 2px 4px rgba(0,0,0,0.1)"
                  : "0 2px 6px rgba(37,99,235,0.3)",
            }}
          >
            {m.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* الإدخال */}
      <div style={{ display: "flex", marginTop: "8px", gap: "6px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اكتب سؤالك أو طلبك هنا..."
          style={{
            flex: 1,
            background: "#f9fafb",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            padding: "8px",
            color: "#1e293b",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleSend}
          disabled={isRunning}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: isRunning ? "#94a3b8" : "#2563eb",
            color: "white",
            cursor: isRunning ? "default" : "pointer",
          }}
        >
          {isRunning ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
