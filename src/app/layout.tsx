import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "مساعد الخطابات الرسمية",
  description: "منصة ذكية تابعة لبيّه لتوليد وتعديل الخطابات الرسمية بسهولة واحترافية.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* خط جميل وأنيق للواجهة */}
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Tajawal', system-ui, sans-serif" }}>
        {/* ===== Header ===== */}
        <header
          className="app-header"
          style={{
            background: "#f8fafc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: "18px 0",
            marginBottom: "25px",
          }}
        >
          <div
            className="app-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start", // 👈 يخليهم على اليسار
              gap: "14px",
              flexDirection: "row", // 👈 الترتيب الطبيعي: اللوقو ثم العنوان
            }}
          >
            {/* ✨ اللوقو */}
            <Image
              src="/LB - Logo.png"
              alt="Labeih Logo"
              width={70}
              height={70}
              style={{
                objectFit: "contain",
                marginLeft: "4px",
              }}
            />

            {/* ✨ العنوان */}
            <h1
              style={{
                fontSize: "32px",
                color: "#1e3a8a",
                fontWeight: 800,
                margin: 0,
                letterSpacing: "0.3px",
              }}
            >
              مساعد الخطابات الرسمية
            </h1>
          </div>
        </header>

        {/* ===== Main ===== */}
        <main
          className="app-container"
          style={{ display: "block", padding: "24px 0" }}
        >
          {children}
        </main>

        {/* ===== Footer ===== */}
        <footer
          className="app-footer"
          style={{
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
            color: "#64748b",
            padding: "12px 0",
            fontSize: "14px",
          }}
        >
          © {new Date().getFullYear()} لبيّه - جميع الحقوق محفوظة
        </footer>
      </body>
    </html>
  );
}
