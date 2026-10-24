# دليل النشر الرسمي — أزهار دمشق | Damascus Flowers على `damascusflowers.com`

## 0. ملخص ما يحتاجه المشروع (نتيجة الفحص)

| العنصر | الحالة |
|---|---|
| الإطار | Next.js 16 (App Router) — يحتاج خادم Node.js (ليس موقعًا ثابتًا) |
| قاعدة البيانات | PostgreSQL — مطلوبة (المنتجات، الطلبات، الإعدادات، رسائل التواصل) |
| الصور | 60 صورة منتج محفوظة داخل المشروع (16 MB) + الصور المرفوعة من لوحة الإدارة تُحفظ على القرص في `public/images/uploads` |
| خدمات مدفوعة خارجية | **لا شيء** — لا Stripe، لا تخزين سحابي، واتساب Cloud API اختياري |
| متغيرات البيئة | `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL` (+ 3 اختيارية لواتساب) |

**الخلاصة:** يحتاج الموقع **خادمًا واحدًا** يشغّل Node + PostgreSQL + قرصًا دائمًا للصور. أرخص وأبسط خيار موثوق: **VPS صغير + Docker Compose** (كل شيء مجهّز في المشروع).

---

## 1. خيارات الاستضافة والتكلفة (اختر واحدًا — لن أشتري شيئًا دون موافقتك)

| الخيار | التكلفة الشهرية | المميزات | الملاحظات |
|---|---|---|---|
| **A) VPS + Docker (موصى به)** — Hetzner CX22 أو DigitalOcean Basic أو Contabo | **≈ 4–6 $** | كل شيء على خادم واحد: الموقع + قاعدة البيانات + الصور + SSL مجاني تلقائي | الأرخص على المدى الطويل، تحكم كامل، نسخ احتياطي سهل |
| B) Railway (App + Postgres + Volume) | ≈ 5–10 $ | نشر من GitHub بنقرة، بدون إدارة خادم | يحتاج Volume للصور المرفوعة |
| C) Render (Web Service + Postgres) | ≈ 7 $ + 7 $ للـ Postgres الدائم | سهل | الخطة المجانية لـ Postgres تُحذف بعد 90 يومًا — غير مناسبة |
| D) Vercel (مجاني) + Neon Postgres (مجاني) | **0 $** للبداية | أسرع نشر | ⚠️ **لا يحفظ الصور المرفوعة من لوحة الإدارة** (القرص مؤقت) — يحتاج تعديل الرفع إلى تخزين سحابي (Cloudinary مجاني حتى 25 GB) |

> **توصيتي:** الخيار **A** بتكلفة ≈ 5 $ شهريًا. كل الملفات اللازمة له جاهزة الآن في المشروع. الخيار D ممكن مجانًا لكنه يتطلب تعديلًا إضافيًا لتخزين الصور خارجيًا — أخبرني إن فضّلته.

**التكاليف الإجمالية المتوقعة (الخيار A):** VPS ≈ 5 $/شهر + الدومين (مدفوع لديك حتى 2027-02-22) = **≈ 60 $ سنويًا**. لا توجد أي تكلفة أخرى.

---

## 2. الملفات الجاهزة للنشر (أُضيفت للمشروع)

| الملف | الغرض |
|---|---|
| `Dockerfile` | بناء نسخة إنتاج خفيفة (Next.js standalone) |
| `docker-compose.yml` | تشغيل الموقع + PostgreSQL 16 + Caddy (HTTPS تلقائي) مع أقراص دائمة للبيانات والصور |
| `Caddyfile` | شهادة SSL مجانية تلقائية من Let's Encrypt + تحويل `www` → الدومين الرئيسي |
| `.env.example` | قالب متغيرات البيئة |
| `scripts/deploy.sh` | تثبيت Docker + بناء + تشغيل + تطبيق مخطط قاعدة البيانات بأمر واحد |
| `scripts/restore-backup.ts` | استيراد المنتجات/الإعدادات من ملف النسخة الاحتياطية |
| `scripts/backup-db.sh` | نسخ احتياطي يومي لقاعدة البيانات والصور |
| `backups/damascus-flowers-catalog-export.json` | **نسخة كاملة من كتالوجك الحالي (30 منتجًا + الأقسام + الإعدادات)** جاهزة للاستيراد |

---

## 3. خطوات النشر الفعلية (الخيار A — VPS)

### الخطوة 1: استئجار الخادم (≈ 5 $/شهر)
1. أنشئ حسابًا في **Hetzner Cloud** (hetzner.com/cloud) أو DigitalOcean.
2. أنشئ خادمًا: **Ubuntu 24.04**، أصغر حجم (CX22: 2 vCPU / 4 GB RAM / 40 GB)، أقرب موقع (ألمانيا/فنلندا مناسب للأردن).
3. أضف مفتاح SSH أو استخدم كلمة مرور الجذر المرسلة بالبريد.
4. احفظ **عنوان IP** الخادم (مثال: `91.98.x.x`).

### الخطوة 2: رفع المشروع إلى الخادم
من جهازك (بعد تنزيل مجلد المشروع):
```bash
# ضغط المشروع بدون node_modules
tar --exclude=node_modules --exclude=.next -czf damascus-flowers.tar.gz .
scp damascus-flowers.tar.gz root@SERVER_IP:/root/
ssh root@SERVER_IP
mkdir -p /opt/damascus-flowers && cd /opt/damascus-flowers
tar -xzf /root/damascus-flowers.tar.gz
```
> أو ارفع المشروع إلى مستودع GitHub خاص ثم `git clone` على الخادم.

### الخطوة 3: إعداد متغيرات البيئة
```bash
cp .env.example .env
nano .env
```
عدّل:
- `POSTGRES_PASSWORD` و`DATABASE_URL` بكلمة مرور قوية (نفسها في المكانين).
- `ADMIN_SESSION_SECRET`: ناتج الأمر `openssl rand -hex 32`.
- `ADMIN_PASSWORD`: كلمة مرور الإدارة الأولية.
- `NEXT_PUBLIC_SITE_URL=https://damascusflowers.com`.

### الخطوة 4: التشغيل بأمر واحد
```bash
bash scripts/deploy.sh
```
يقوم بتثبيت Docker، بناء الموقع، تشغيل PostgreSQL، وتطبيق الجداول. (يستغرق 3–5 دقائق أول مرة.)

### الخطوة 5: استيراد كتالوجك الحالي (30 منتجًا بصورها)
```bash
docker compose exec -T app node node_modules/tsx/dist/cli.mjs scripts/restore-backup.ts backups/damascus-flowers-catalog-export.json
```
> الصور الأصلية موجودة داخل المشروع في `public/images/products` وتُنشر تلقائيًا مع الموقع.

### الخطوة 6: اختبار قبل ربط الدومين
```bash
curl -s http://127.0.0.1/api/health -H "Host: damascusflowers.com"   # يجب أن يعيد {"ok":true}
```
ولمعاينة الموقع من المتصفح قبل تحويل الدومين: أضف مؤقتًا في ملف `hosts` على جهازك السطر `SERVER_IP damascusflowers.com`، أو انتظر ربط الدومين (Caddy يصدر SSL فقط بعد أن يشير الدومين للخادم).

---

## 4. ربط الدومين `damascusflowers.com` (بدون أي تغيير في ملكية الدومين)

وضعك الحالي: الدومين مسجّل في **NameCheap**، وسجلات DNS تُدار في **GoDaddy** (`ns01/ns02.domaincontrol.com`)، ويشير حاليًا إلى `68.178.205.218` (ووردبريس). لا توجد سجلات بريد `MX`.

1. **خذ لقطة شاشة لسجلات DNS الحالية** في GoDaddy (للرجوع عند الحاجة).
2. في GoDaddy → DNS Management لنطاق `damascusflowers.com`:
   - عدّل السجل `A` للاسم `@`: من `68.178.205.218` → **IP الخادم الجديد**. (TTL: 600 ثانية)
   - تأكد أن `www` سجل `CNAME` يشير إلى `damascusflowers.com` (موجود حاليًا — لا تغيّره).
   - **لا تحذف أو تعدّل أي سجل آخر** (TXT / MX إن وُجدت مستقبلًا).
3. انتظر 5–30 دقيقة. Caddy سيكتشف الدومين ويصدر شهادة HTTPS تلقائيًا.
4. افتح `https://damascusflowers.com` — يجب أن يظهر الموقع الجديد بقفل الأمان.

**خطة الرجوع:** أبقِ استضافة GoDaddy القديمة فعّالة أسبوعين؛ عند أي مشكلة أعد السجل `A` إلى `68.178.205.218` ويعود الموقع القديم خلال دقائق.

---

## 5. محركات البحث (SEO) — جاهز في الموقع

- ✅ `https://damascusflowers.com/sitemap.xml` (ديناميكي: كل المنتجات والأقسام والصفحات)
- ✅ `https://damascusflowers.com/robots.txt` (يسمح بالمتجر، يمنع `/admin` و`/api`)
- ✅ عناوين ووصف عربية لكل صفحة، Canonical، Open Graph (`ar_JO`)، بيانات منظّمة `Florist` + `Product` (السعر بالدينار، التوفر)
- ✅ تحويلات 301 لجميع روابط ووردبريس القديمة (المنتجات والأقسام والصفحات)
- ✅ أسماء صور وصفية ونصوص بديلة عربية

**بعد ربط الدومين (10 دقائق):**
1. افتح **Google Search Console** → أضف `damascusflowers.com` (Domain property) → تحقق عبر سجل TXT في GoDaddy (أو ضع رمز التحقق في `src/app/layout.tsx` حيث التعليق `verification`).
2. أرسل `https://damascusflowers.com/sitemap.xml`.
3. أنشئ/حدّث **Google Business Profile** باسم «أزهار دمشق | Damascus Flowers» ورقم واتساب والرابط.

---

## 6. النسخ الاحتياطي والتحديثات

- **نسخة احتياطية يومية تلقائية:** على الخادم `crontab -e` وأضف:
  `0 3 * * * cd /opt/damascus-flowers && docker compose exec -T db pg_dump -U damascus damascus_flowers | gzip > backups/db-$(date +\%F).sql.gz`
- **من لوحة الإدارة:** زر «تنزيل نسخة احتياطية» في أي وقت.
- **تحديث الموقع لاحقًا:** ارفع الملفات المعدّلة ثم `bash scripts/deploy.sh` (بدون توقف يُذكر).

---

## 7. قائمة التحقق النهائية قبل الإعلان

- [ ] غيّر كلمة مرور لوحة الإدارة من `/admin` بعد أول دخول.
- [ ] راجع مناطق التوصيل (حاليًا بدون أسعار معروضة — «تُحدَّد حسب الحي والمنطقة») وحدّد أسعارًا إن رغبت.
- [ ] حدّد سعر علبة الشوكولاتة والدبدوب (منتجات إضافية) أو أبقِها «يُحدَّد عند الطلب».
- [ ] اختبر طلبًا حقيقيًا من هاتفك وتأكد من وصوله للوحة الإدارة ورسالة واتساب.
- [ ] أضف الموقع في Google Search Console وأرسل الـ sitemap.
