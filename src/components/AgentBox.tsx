
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

  // ✅ التمرير التلقائي لآخر رسالة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 💾 استرجاع المحادثة من التخزين المحلي عند فتح المستند
  useEffect(() => {
    const saved = localStorage.getItem(`chat-history-${documentId}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [documentId]);

  // 💾 حفظ المحادثة في التخزين المحلي
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
          messages: updatedMessages,       // ✅ السيرفر يحتاج هذه
          rules: policies || "",           // ✅ بدل policies بـ rules
          document: documentContent || "", // ✅ نص المستند الحالي
          document_title: documentTitle || "", // ✅ الاسم الصحيح
        }),
      });

      const data = await response.json();

      // ✅ إذا الإيجنت عدّل المستند
      if (data.document_update) {
        onApply(data.document_update);
      }

      // ✅ أضف الرد العادي للمحادثة
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "لم يتم استلام رد." },
      ]);

    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ حدث خطأ أثناء الاتصال بالخادم." },
      ]);
    } finally {
      setIsRunning(false);
    }
  }


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <h3
        style={{
          margin: "0 0 4px 0",
          padding: 0,
          fontSize: "16px",
          fontWeight: "600",
          color: "#b2b2ff",
          textAlign: "center",
        }}
      >
        Agent Chat
      </h3>

      {/* ✅ منطقة المحادثة */}
<div
  style={{
    flex: "1 1 auto",
    overflowY: "auto",
    maxHeight: "700px", // 👈 يحدد أقصى ارتفاع للمحادثة
    background: "transparent",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px",
    color: "white",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    scrollBehavior: "smooth",
  }}
>

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#6366f1" : "#1f1f1f",
              borderRadius: "10px",
              padding: "8px 12px",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
            }}
          >
            {m.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* ✅ منطقة الإدخال */}
      <div style={{ display: "flex", marginTop: "8px", gap: "6px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اكتب سؤالك أو طلبك هنا..."
          style={{
            flex: 1,
            background: "transparent",
            border: "1px solid #333",
            borderRadius: "6px",
            padding: "8px",
            color: "white",
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
            backgroundColor: isRunning ? "#444" : "#6366f1",
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
