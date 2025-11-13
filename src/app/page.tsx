// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ لازم للاستبدال
import { loadDocs, createDoc, type Doc } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧠 تحميل المستندات من قاعدة البيانات عند فتح الصفحة
  useEffect(() => {
    async function fetchDocs() {
      try {
        const data = await loadDocs();
        setDocs(data);
      } catch (err) {
        console.error("Error loading docs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDocs();
  }, []);

  // ➕ إنشاء مستند جديد في قاعدة البيانات
  async function handleCreateDoc() {
    try {
      const newDoc = await createDoc({
        title: "Untitled.md",
        content: "# New Document\n\nWrite something...",
        author: "Rahaf", // مؤقتاً إلى أن نضيف login
      });

      if (!newDoc || !newDoc.id) {
        alert("حدث خطأ أثناء إنشاء المستند 😥");
        return;
      }

      // أضفه إلى القائمة الحالية مباشرة
      setDocs((prev) => [newDoc, ...prev]);

      // ✅ انتقل إليه فوراً
      router.push(`/documents/${newDoc.id}`);
    } catch (err) {
      console.error("Error creating doc:", err);
      alert("تعذر إنشاء المستند الجديد!");
    }
  }

  // 🗑️ حذف مستند من القائمة فقط (مؤقتاً)
  // 🗑️ حذف مستند من قاعدة البيانات
async function handleDeleteLocal(id: number) {
  if (!confirm("هل أنتِ متأكدة من حذف هذا المستند؟")) return;

  try {
    const res = await fetch(`http://127.0.0.1:8000/documents/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Delete failed:", await res.text());
      alert("تعذر حذف المستند من قاعدة البيانات 😥");
      return;
    }

    // ✅ نحذف محلياً بعد نجاح الحذف من السيرفر
    setDocs((prev) => prev.filter((d) => d.id !== id));
  } catch (err) {
    console.error("Error deleting doc:", err);
    alert("⚠️ حدث خطأ أثناء الاتصال بالخادم.");
  }
}


  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "#bbb",
          marginTop: "40px",
          fontSize: "18px",
        }}
      >
        Loading documents...
      </div>
    );
  }

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "20px",
      }}
    >
      {/* ====== Header ====== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h2 style={{ margin: 0, color: "#fff" }}>Documents</h2>
        <button
          onClick={handleCreateDoc}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          New
        </button>
      </div>

      {/* ====== Documents List ====== */}
      {docs.length === 0 ? (
        <p style={{ color: "#888" }}>No documents yet. Click “New”.</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: 8,
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {docs.map((d) => (
            <li
              key={d.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #222",
                borderRadius: 8,
                padding: "10px 14px",
                background: "#0a0a0a",
              }}
            >
              {/* ✅ تم استبدال <a> بـ <Link> لتفعيل التنقل داخل Next.js */}
              <Link
                href={`/documents/${d.id}`}
                style={{
                  flex: 1,
                  textDecoration: "none",
                  color: "#e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{d.title}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  {d.updatedAt
                    ? new Date(d.updatedAt).toLocaleString()
                    : "unknown"}
                </span>
              </Link>

              <button
                onClick={() => handleDeleteLocal(d.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f87171",
                  fontSize: "18px",
                  cursor: "pointer",
                  marginLeft: "10px",
                  transition: "color 0.2s ease",
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLButtonElement).style.color = "#ef4444")
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLButtonElement).style.color = "#f87171")
                }
                title="Delete locally"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
