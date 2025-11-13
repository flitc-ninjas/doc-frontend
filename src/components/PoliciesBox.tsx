// src/components/PoliciesBox.tsx
"use client";

import React from "react";

type PoliciesBoxProps = {
  value: string;
  onChange: (val: string) => void;
};

export default function PoliciesBox({ value, onChange }: PoliciesBoxProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* العنوان */}
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
        Policies / Rules
      </h3>

      {/* مربع الكتابة */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="اكتب القواعد هنا (مثلاً: صياغة رسمية، أقسام محددة...)"
        style={{
          flex: 1,
          maxHeight: "750px",
          overflowY: "scroll",
          scrollbarWidth: "thin",
          width: "100%",
          background: "#f9fafb",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          padding: "10px",
          color: "#1e293b",
          fontSize: "14px",
          resize: "none",
          lineHeight: "1.6",
           boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
        }}
      />
    </div>
  );
}
