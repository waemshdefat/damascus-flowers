import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
      <h1 className="text-3xl font-extrabold text-[#3D2B1F]">الصفحة غير موجودة</h1>
      <p className="text-sm text-[#695244]">ربما تم نقل المنتج أو تغيير الرابط. تصفح المتجر لاختيار باقتك.</p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link href="/shop" className="px-6 py-3 rounded-2xl bg-[#FFFDFB] text-[#3D2B1F] border border-[#D8C7B4] text-sm font-bold">تصفح المتجر</Link>
        <Link href="/" className="px-6 py-3 rounded-2xl border border-[#D4C5B3] text-[#3D2B1F] text-sm font-bold">الرئيسية</Link>
      </div>
    </div>
  );
}
