"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF7F2",
          color: "#3D2B1F",
          fontFamily: "Tajawal, system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>أزهار دمشق | Damascus Flowers</h1>
          <p style={{ fontSize: 14, color: "#695244", margin: "8px 0 20px" }}>
            تعذّر تحميل الموقع مؤقتًا. اضغط إعادة المحاولة، أو تواصل معنا عبر واتساب.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => reset()}
              style={{ padding: "12px 22px", borderRadius: 14, background: "#3D2B1F", color: "#FAF7F2", fontWeight: 700, border: 0 }}
            >
              إعادة المحاولة
            </button>
            <a
              href="https://wa.me/962795831917"
              style={{ padding: "12px 22px", borderRadius: 14, background: "#1F8E4D", color: "#fff", fontWeight: 700, textDecoration: "none" }}
            >
              واتساب
            </a>
          </div>
          {error?.digest && (
            <p style={{ fontSize: 11, color: "#9A8474", marginTop: 16 }} dir="ltr">ref: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
