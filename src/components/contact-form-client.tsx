"use client";

import React, { useState } from "react";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";

export function ContactFormClient() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sentWaUrl, setSentWaUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "تعذّر إرسال الرسالة.");
      } else {
        setSentWaUrl(data.whatsappUrl || null);
        setName("");
        setPhone("");
        setSubject("");
        setMessage("");
      }
    } catch {
      setErrorMsg("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setSending(false);
    }
  };

  if (sentWaUrl) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[#EFF9F2] border border-[#BFE5CA] space-y-4">
        <div className="flex items-center gap-3 text-[#175933]">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <h3 className="text-lg font-extrabold">تم استلام رسالتك بنجاح!</h3>
        </div>
        <p className="text-sm text-[#2A5C3F]">
          وصلت رسالتك إلى لوحة إدارة أزهار دمشق، ويمكنك أيضًا متابعة المحادثة مباشرة
          عبر واتساب للحصول على رد أسرع:
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={sentWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#1F8E4D] text-white text-sm font-bold inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>متابعة الرسالة عبر واتساب</span>
          </a>
          <button
            type="button"
            onClick={() => setSentWaUrl(null)}
            className="px-5 py-3 rounded-xl bg-white border border-[#BFE5CA] text-xs font-bold text-[#175933] cursor-pointer"
          >
            إرسال رسالة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5 shadow-2xs"
    >
      <h2 className="text-xl font-extrabold text-[#3D2B1F]">أرسل لنا رسالة</h2>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-bold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
            الاسم *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="الاسم الكريم"
            className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            required
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="079XXXXXXX"
            className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F] text-right"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
          الموضوع (اختياري)
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="مثال: تنسيق خاص لمناسبة / استفسار عن طلب"
          className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
          نص الرسالة أو الاستفسار *
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب تفاصيل استفسارك هنا..."
          className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full py-4 px-6 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs disabled:opacity-60 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>{sending ? "جاري الإرسال..." : "إرسال الرسالة"}</span>
      </button>
    </form>
  );
}
