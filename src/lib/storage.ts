// src/lib/storage.ts
// Database-connected helpers using FastAPI backend instead of localStorage.
// Doc shape matches database model.

export type Doc = {
  id: number;         // رقم المستند في قاعدة البيانات
  title: string;      // اسم المستند
  content: string;    // النص الكامل (Markdown)
  author?: string;    // اسم المستخدم أو الكاتب
  createdAt?: string; // تاريخ الإنشاء
  updatedAt?: string; // تاريخ آخر تعديل
};

// 🔗 رابط السيرفر تبع FastAPI (غيّريه حسب البورت اللي عندك)
const API_BASE = "http://localhost:8000";


// 📦 1) جلب كل المستندات من قاعدة البيانات
export async function loadDocs(): Promise<Doc[]> {
  try {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error("Failed to load docs");
    return await res.json();
  } catch (err) {
    console.error("Error loading docs:", err);
    return [];
  }
}

// 📄 2) جلب مستند واحد حسب ID
export async function getDoc(id: string | number): Promise<Doc | null> {
  try {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error loading doc:", err);
    return null;
  }
}

// 💾 3) إنشاء مستند جديد في قاعدة البيانات
export async function createDoc(data: { title: string; content: string; author: string }): Promise<Doc | null> {
  try {
    const res = await fetch(`${API_BASE}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create doc");
    return await res.json();
  } catch (err) {
    console.error("Error creating doc:", err);
    return null;
  }
}

// ✏️ 4) تحديث مستند موجود (Auto-save)
export async function updateDoc(
  id: number,
  data: { title: string; content: string; author: string }
): Promise<Doc | null> {
  try {
    // ✅ تأكدنا نحفظ المحتوى الناتج فقط (مش الأمر اللي كتبتيه)
    const cleanContent = data.content || "";

    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        content: cleanContent,
        author: data.author,
      }),
    });

    if (!res.ok) throw new Error("Failed to update doc");
    const updated = await res.json();

    // نخزن العنوان محليًا حتى الإيجنت يقدر يعرف اسم المستند الحالي
    localStorage.setItem(`doc-title-${id}`, data.title || "المستند الحالي");

    return updated;
  } catch (err) {
    console.error("Error updating doc:", err);
    return null;
  }
}

