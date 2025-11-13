"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AgentBox from "@/components/AgentBox";
import Preview from "@/components/Preview";
import PoliciesBox from "@/components/PoliciesBox";
import { getDoc, createDoc, updateDoc, type Doc } from "@/lib/storage";
import styles from "./page.module.css";

type Params = { id: string };

export default function DocumentPage() {
  const { id } = useParams<Params>();
  const router = useRouter();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [policies, setPolicies] = useState<string>("");

  // ✅ Load document
  useEffect(() => {
    if (!id) return;
    async function fetchDoc() {
      const found = await getDoc(id);
      if (!found) {
        router.push("/");
        return;
      }
      setDoc(found);
    }
    fetchDoc();
  }, [id, router]);

  // 💾 Load and save policies
  useEffect(() => {
    if (!id) return;
    const savedPolicies = localStorage.getItem(`doc-policies-${id}`);
    if (savedPolicies) setPolicies(savedPolicies);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    localStorage.setItem(`doc-policies-${id}`, policies);
  }, [policies, id]);

  // ✏️ Update document
  async function update(partial: Partial<Doc>) {
    if (!doc) return;
    const next: Doc = { ...doc, ...partial };
    setDoc(next);
    try {
      await updateDoc(next.id, {
        title: next.title,
        content: next.content,
        author: next.author || "Rahaf",
      });
    } catch (err) {
      console.error("Error updating doc:", err);
    }
  }

  // 💾 Download document
  function downloadDoc() {
    if (!doc) return;
    const blob = new Blob([doc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.title || "document.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ➕ Create new document
  async function createNewDoc() {
    try {
      const newDoc = await createDoc({
        title: "Untitled.md",
        content: "# مستند جديد\n\nابدئي بالكتابة هنا...",
        author: "Rahaf",
      });

      if (!newDoc?.id) {
        alert("حدث خطأ أثناء إنشاء المستند 😥");
        return;
      }

      router.push(`/documents/${newDoc.id}`);
    } catch (err) {
      console.error("Error creating new doc:", err);
      alert("تعذر إنشاء المستند الجديد!");
    }
  }

  if (!doc) return null;
  const title = doc.title || "Untitled.md";

  return (
    <section className={styles.docPage}>
      {/* ====== Title + Buttons ====== */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <input
          type="text"
          value={doc.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="اكتب اسم المستند هنا..."
          style={{
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #93c5fd",
            color: "#2563eb",
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
            outline: "none",
            width: "280px",
          }}
        />

        <button
          onClick={createNewDoc}
          style={{
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(59,130,246,0.3)",
          }}
        >
          New
        </button>

        <button
          onClick={downloadDoc}
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(16,185,129,0.3)",
          }}
        >
          Download
        </button>
      </div>

      {/* ====== Main Layout ====== */}
      <div className={styles.docGrid}>
        <div>
          <AgentBox
            documentId={String(doc.id)}
            documentContent={doc.content}
            policies={policies}
            onApply={(newContent) => update({ content: newContent })}
            documentTitle={doc.title}
          />
        </div>

        <div className={styles.previewWrap}>
          <Preview content={doc.content} />
        </div>

        <div>
          <PoliciesBox value={policies} onChange={setPolicies} />
        </div>
      </div>
    </section>
  );
}
