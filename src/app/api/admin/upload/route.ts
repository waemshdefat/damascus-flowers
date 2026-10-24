import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { isAdminAuthenticated } from "@/lib/auth";
import { slugifyInput } from "@/lib/validation";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

/**
 * Image upload strategy:
 *  - If CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET) is set → upload to Cloudinary
 *    (required on serverless hosts like Vercel where the filesystem is not persistent).
 *  - Otherwise → save to public/images/uploads on local disk (VPS / Docker volume).
 */
function getCloudinaryConfig() {
  const url = process.env.CLOUDINARY_URL; // cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) return { cloudName, apiKey, apiSecret };
  return null;
}

async function uploadToCloudinary(
  jpegBuffer: Buffer,
  publicId: string,
  cfg: { cloudName: string; apiKey: string; apiSecret: string }
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "damascus-flowers/products";
  // Signature: sha1 of sorted params + api_secret
  const toSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${cfg.apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(jpegBuffer)], { type: "image/jpeg" }), `${publicId}.jpg`);
  form.append("api_key", cfg.apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cfg.cloudName)}/image/upload`,
    { method: "POST", body: form }
  );
  const data = (await res.json().catch(() => ({}))) as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || `Cloudinary upload failed (${res.status})`);
  }
  return data.secure_url;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "يرجى اختيار ملف صورة صالح." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "حجم الصورة يتجاوز الحد المسموح (8 ميجابايت)." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const baseName = slugifyInput(file.name.replace(/\.[^.]+$/, ""));
    const fileId = `${baseName}-${Date.now()}`;

    const optimized = await sharp(buffer)
      .rotate()
      .resize(1200, 1400, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer();

    const cloudinary = getCloudinaryConfig();
    if (cloudinary) {
      const url = await uploadToCloudinary(optimized, fileId, cloudinary);
      return NextResponse.json({ ok: true, url, storage: "cloudinary" });
    }

    // Local disk (VPS / Docker volume)
    const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, `${fileId}.jpg`), optimized);

    return NextResponse.json({
      ok: true,
      url: `/images/uploads/${fileId}.jpg`,
      storage: "local",
    });
  } catch (err) {
    console.error("Image upload failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "تعذّرت معالجة الصورة المرفوعة. (على استضافة Vercel يجب إضافة CLOUDINARY_URL في الإعدادات)",
      },
      { status: 400 }
    );
  }
}
