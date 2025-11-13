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
      {/* العنوان بدون أي margin */}
      <h3
        style={{
          margin: "0 0 4px 0", // صفر فوق وتحت مسافة خفيفة جداً تحت
          padding: 0,
          fontSize: "16px",
          fontWeight: "600",
          color: "#b2b2ff",
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
          background: "transparent",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "10px",
          color: "white",
          fontSize: "14px",
          resize: "none",
        }}
      />
    </div>
  );
}
