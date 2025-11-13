"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadDocs, createDoc, type Doc } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function handleCreateDoc() {
    try {
      const newDoc = await createDoc({
        title: "Untitled.md",
        content: "# New Document\n\nWrite something...",
        author: "Rahaf",
      });

      if (!newDoc || !newDoc.id) {
        alert("حدث خطأ أثناء إنشاء المستند 😥");
        return;
      }

      setDocs((prev) => [newDoc, ...prev]);
      router.push(`/documents/${newDoc.id}`);
    } catch (err) {
      console.error("Error creating doc:", err);
      alert("تعذر إنشاء المستند الجديد!");
    }
  }

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
          color: "#6b7280",
          marginTop: "40px",
          fontSize: "18px",
        }}
      >
        جارِ تحميل المستندات...
      </div>
    );
  }

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "40px 20px",
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', 'Noto Sans Arabic', sans-serif",
      }}
    >
      {/* ====== Header ====== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "700px",
          paddingBottom: "10px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <h2 style={{ margin: 0, color: "#2563eb", fontSize: "24px" }}>
          المستندات
        </h2>
        <button
          onClick={handleCreateDoc}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 2px 6px rgba(59,130,246,0.3)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.transform = "scale(1.03)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 4px 10px rgba(59,130,246,0.4)";
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.transform = "scale(1)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 2px 6px rgba(59,130,246,0.3)";
          }}
        >
          مستند جديد
        </button>
      </div>

      {/* ====== Documents List ====== */}
      {docs.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          لا توجد مستندات بعد — اضغطي على "مستند جديد"
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: 10,
            width: "100%",
            maxWidth: "700px",
          }}
        >
          {docs.map((d) => (
            <li
              key={d.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "12px 18px",
                background: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLLIElement).style.boxShadow =
                  "0 4px 10px rgba(147,197,253,0.25)")
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLLIElement).style.boxShadow =
                  "0 2px 6px rgba(0,0,0,0.05)")
              }
            >
              <Link
                href={`/documents/${d.id}`}
                style={{
                  flex: 1,
                  textDecoration: "none",
                  color: "#1e293b",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: 500,
                }}
              >
                <span>{d.title}</span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  {d.updatedAt
                    ? new Date(d.updatedAt).toLocaleString()
                    : "غير معروف"}
                </span>
              </Link>

              <button
                onClick={() => handleDeleteLocal(d.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "18px",
                  cursor: "pointer",
                  marginLeft: "10px",
                  transition: "transform 0.2s ease, color 0.2s ease",
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.color = "#dc2626";
                  (e.target as HTMLButtonElement).style.transform = "scale(1.1)";
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.color = "#ef4444";
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
                title="حذف المستند"
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
