import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doc Editor – Phase 1",
  description: "Simple UI layout for document editor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {/* Header */}
        <header className="app-header">
          <div className="app-container">
            <h1 className="brand">Doc Editor</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="app-container">{children}</main>

        {/* Footer */}
        <footer className="app-footer">
        </footer>
      </body>
    </html>
  );
}
