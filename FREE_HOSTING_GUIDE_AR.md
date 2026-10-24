# نشر «أزهار دمشق» مجانًا بدون VPS — Vercel + Neon + Cloudinary (≈ 30 دقيقة، بدون سطر أوامر)

## ماذا يعمل مجانًا وما قد يحتاج دفعًا؟

| الخدمة | الخطة المجانية | يكفي لمتجر الزهور؟ | متى تدفع؟ |
|---|---|---|---|
| **Vercel** (استضافة الموقع + API) | 100 GB نقل شهريًا، HTTPS ودومين مخصص مجانًا | ✅ نعم بوفرة | فقط إن تجاوزت ~100 ألف زيارة/شهر (Pro = 20 $/شهر) |
| **Neon** (قاعدة بيانات PostgreSQL) | 0.5 GB تخزين، يُوقف تلقائيًا عند الخمول ويستيقظ خلال ~1 ثانية | ✅ نعم (بياناتك الآن < 1 MB) | عند تجاوز 0.5 GB (بعد عشرات آلاف الطلبات) |
| **Cloudinary** (رفع صور المنتجات من لوحة الإدارة) | 25 GB تخزين + 25 GB نقل شهريًا | ✅ نعم (≈ 10,000 صورة) | عمليًا لن تحتاج |
| الدومين `damascusflowers.com` | مدفوع لديك حتى 2027-02 | ✅ | عند التجديد السنوي فقط |

> **ملاحظات صادقة:**
> - الصور الـ60 الحالية مضمّنة داخل المشروع وتعمل على Vercel مباشرة. Cloudinary مطلوب فقط للصور **الجديدة** التي سترفعها من لوحة الإدارة لاحقًا.
> - استيقاظ Neon بعد الخمول يُبطئ **أول** زيارة بعد فترة هدوء بنحو ثانية واحدة — مقبول لمتجر صغير. إن أزعجك ذلك لاحقًا، خطة Neon Launch = 19 $/شهر أو VPS ≈ 5 $/شهر.
> - الإجمالي الشهري الآن: **0 دولار**.

---

## قبل البدء — ملف واحد
نزّل `damascus-flowers-production.zip` وفكّ ضغطه على جهازك (مجلد `damascus-flowers`).

---

## الخطوة 1 — قاعدة البيانات (Neon) — 5 دقائق
1. افتح **https://neon.tech** → **Sign up** (بحساب Google أو GitHub).
2. **Create project** → الاسم `damascus-flowers` → المنطقة **AWS Europe (Frankfurt)** → Create.
3. في لوحة المشروع اضغط **Connect** → اختر **Pooled connection** → انسخ النص الذي يبدأ بـ `postgresql://` وينتهي بـ `?sslmode=require`.
   احتفظ به — هذا هو `DATABASE_URL`.

## الخطوة 2 — تخزين الصور (Cloudinary) — 3 دقائق
1. افتح **https://cloudinary.com/users/register_free** → أنشئ حسابًا مجانيًا.
2. من لوحة التحكم → **Settings (⚙) → API Keys** → انسخ قيمة **API environment variable** (تبدأ بـ `cloudinary://`).
   احتفظ بها — هذه هي `CLOUDINARY_URL`.

## الخطوة 3 — رفع المشروع إلى GitHub — 5 دقائق
1. افتح **https://github.com** → أنشئ حسابًا (إن لم يكن لديك) → **New repository** → الاسم `damascus-flowers` → اختر **Private** → Create.
2. في صفحة المستودع الفارغ اضغط **uploading an existing file** → اسحب **محتويات** مجلد `damascus-flowers` (الملفات والمجلدات داخله، وليس المجلد نفسه) → **Commit changes**.
   > إن رفض المتصفح الرفع بسبب العدد، ارفع المجلدات واحدًا تلو الآخر (`src`, `public`, `scripts`, `backups`) ثم بقية الملفات.

## الخطوة 4 — النشر على Vercel — 7 دقائق
1. افتح **https://vercel.com/signup** → **Continue with GitHub**.
2. **Add New → Project** → اختر مستودع `damascus-flowers` → **Import**.
3. قبل الضغط على Deploy، افتح **Environment Variables** وأضف:

| Name | Value |
|---|---|
| `DATABASE_URL` | رابط Neon من الخطوة 1 |
| `CLOUDINARY_URL` | قيمة Cloudinary من الخطوة 2 |
| `ADMIN_PASSWORD` | كلمة مرور قوية تختارها للوحة الإدارة |
| `ADMIN_SESSION_SECRET` | 64 حرفًا عشوائيًا (مثلًا من https://generate-secret.vercel.app/64) |
| `SETUP_KEY` | كلمة سرية عشوائية مؤقتة (مثلًا `setup-8f3k2m9x`) |
| `NEXT_PUBLIC_SITE_URL` | `https://damascusflowers.com` |

4. اضغط **Deploy** وانتظر 2–3 دقائق حتى تظهر 🎉. ستحصل على رابط مثل `https://damascus-flowers-xxxx.vercel.app`.

## الخطوة 5 — تهيئة قاعدة البيانات واستعادة المنتجات — دقيقة واحدة
افتح في المتصفح (استبدل الرابط وقيمة SETUP_KEY):
```
https://damascus-flowers-xxxx.vercel.app/api/setup?key=setup-8f3k2m9x
```
ستظهر رسالة `"ok": true` مع `"catalog restored: 30 products"`. هذا ينشئ الجداول ويستعيد **كل منتجاتك وأقسامك وإعداداتك** من النسخة الاحتياطية المضمّنة.
> بعدها احذف `SETUP_KEY` من إعدادات Vercel (Settings → Environment Variables) ثم **Redeploy** — لتعطيل هذا الرابط نهائيًا.

## الخطوة 6 — الاختبار (قبل الدومين)
على رابط `vercel.app`:
- الرئيسية والمتجر والأقسام تعرض الـ30 منتجًا بصورها ✅
- أضف منتجًا للسلة → «عرض السلة وإتمام الطلب» → أكمل طلبًا تجريبيًا ✅
- `/admin` → ادخل بـ `ADMIN_PASSWORD` → يظهر الطلب التجريبي → **غيّر كلمة المرور** من تبويب الإعدادات ✅
- من لوحة الإدارة جرّب رفع صورة لمنتج (ستُحفظ على Cloudinary) ✅

## الخطوة 7 — ربط الدومين damascusflowers.com (تنفّذها أنت فقط)
1. في Vercel → المشروع → **Settings → Domains** → اكتب `damascusflowers.com` → **Add**، ثم أضف `www.damascusflowers.com` أيضًا (اختر Redirect إلى الرئيسي).
2. سيعرض Vercel السجلات المطلوبة. في **GoDaddy → DNS Management** لنطاقك:
   - عدّل السجل **A** للاسم `@`: من `68.178.205.218` → **`76.76.21.21`** (عنوان Vercel).
   - عدّل/أضف السجل **CNAME** للاسم `www` → **`cname.vercel-dns.com`**.
   - **لا تحذف ولا تعدّل أي سجل آخر.** لا تغيّر شيئًا في NameCheap.
3. خلال 5–30 دقيقة يتحول الموقع ويصدر Vercel شهادة HTTPS تلقائيًا → `https://damascusflowers.com` ✅

**للرجوع عند أي مشكلة:** أعد سجل `A` إلى `68.178.205.218` فيعود الموقع القديم خلال دقائق (أبقِ استضافة GoDaddy القديمة أسبوعين).

## الخطوة 8 — بعد الإطلاق (10 دقائق)
- **Google Search Console** → أضف `damascusflowers.com` → أرسل `https://damascusflowers.com/sitemap.xml`.
- راجع في لوحة الإدارة: أسعار التوصيل (حاليًا «تُحدَّد حسب الحي والمنطقة»)، سعر الشوكولاتة والدبدوب.
- **النسخ الاحتياطي:** زر «تنزيل نسخة احتياطية» في لوحة الإدارة أسبوعيًا (Neon أيضًا يحتفظ بتاريخ 24 ساعة مجانًا).

## تحديث الموقع لاحقًا
أي تعديل في الكود: ارفع الملفات المعدّلة إلى GitHub → Vercel ينشر تلقائيًا خلال دقيقتين.
