"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page-error]", error);
  }, [error]);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#FAF7F2",
        color: "#3D2B1F",
        fontFamily: "Tajawal, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>حدث خلل مؤقت في عرض الصفحة</h1>
        <p style={{ fontSize: 14, color: "#695244", marginBottom: 20 }}>
          نعتذر عن الإزعاج. يمكنك إعادة المحاولة الآن أو العودة إلى الصفحة الرئيسية.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{ padding: "12px 22px", borderRadius: 14, background: "#3D2B1F", color: "#FAF7F2", fontWeight: 700, border: 0 }}
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            style={{ padding: "12px 22px", borderRadius: 14, border: "1px solid #D4C5B3", color: "#3D2B1F", fontWeight: 700, textDecoration: "none" }}
          >
            الرئيسية
          </a>
        </div>
        {error?.digest && (
          <p style={{ fontSize: 11, color: "#9A8474", marginTop: 16 }} dir="ltr">
            ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
