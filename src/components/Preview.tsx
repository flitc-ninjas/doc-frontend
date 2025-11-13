"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type PreviewProps = {
  content: string;
};

export default function Preview({ content }: PreviewProps) {
  const clean = content?.trim() || "";

  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: 8,
        padding: 20,
        minHeight: 300,
        backgroundColor: "#0a0a0a",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        direction: "rtl",
        textAlign: "right",
        lineHeight: 1.7,
        overflowY: "scroll",
        scrollbarWidth: "thin",
        maxHeight: "800px"
    
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        skipHtml={false} // 👈 السماح بتنسيق HTML
        components={{
          h1: ({ node, ...props }) => (
            <h1
              style={{
                fontSize: "1.8rem",
                color: "#b2b2ff",
                borderBottom: "1px solid #444",
                paddingBottom: "6px",
                marginBottom: "10px",
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              style={{
                fontSize: "1.4rem",
                color: "#a5a5ff",
                marginTop: "12px",
                marginBottom: "8px",
              }}
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong style={{ color: "#fff", fontWeight: 700 }} {...props} />
          ),
          p: ({ node, ...props }) => (
            <p style={{ margin: "8px 0", fontSize: "1rem" }} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul style={{ margin: "8px 0", paddingRight: "20px" }} {...props} />
          ),
          li: ({ node, ...props }) => (
            <li style={{ marginBottom: "4px" }} {...props} />
          ),
        }}
      >
        {clean || "_لم تتم إضافة أي محتوى بعد_"}
      </ReactMarkdown>
    </div>
  );
}
