import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { hashPassword, verifyAdminPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * One-time, protected admin password reset — does NOT require being logged in.
 *
 *   POST /api/admin/auth/reset   with JSON body { "resetKey": "<ADMIN_RESET_KEY>" }
 *   (GET with ?key=<ADMIN_RESET_KEY> is also accepted so it can be done from a phone browser)
 *
 * Effect: sets store_settings.admin_password_hash = hashPassword(process.env.ADMIN_PASSWORD).
 * Touches ONLY that column. Never logs or returns the password.
 *
 * Protection:
 *  - Disabled entirely unless ADMIN_RESET_KEY is set in the environment (server-only secret).
 *  - Constant-time comparison of the provided key, rate-limited per IP.
 *  - Requires ADMIN_PASSWORD to be set (the value we reset TO).
 *  - Recommended: remove ADMIN_RESET_KEY from Vercel after use → endpoint becomes inert again.
 */
async function handleReset(request: Request, providedKey: string) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`admin-reset:${ip}`, 5, 10 * 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  const resetKey = process.env.ADMIN_RESET_KEY;
  if (!resetKey) {
    // Endpoint is inert when no reset key is configured.
    return NextResponse.json({ ok: false, error: "Reset is disabled." }, { status: 404 });
  }

  const a = Buffer.from(providedKey || "");
  const b = Buffer.from(resetKey);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const target = process.env.ADMIN_PASSWORD;
  if (!target || target.trim().length < 8) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ADMIN_PASSWORD is missing or shorter than 8 characters in the environment. Set it first, redeploy, then retry.",
      },
      { status: 400 }
    );
  }

  const [row] = await db
    .select({ id: storeSettings.id })
    .from(storeSettings)
    .where(eq(storeSettings.id, 1))
    .limit(1);

  const newHash = hashPassword(target.trim());

  if (row) {
    await db
      .update(storeSettings)
      .set({ adminPasswordHash: newHash, updatedAt: new Date() })
      .where(eq(storeSettings.id, 1));
  } else {
    // Settings row missing (fresh DB) — create it with defaults + the hash only.
    await db.insert(storeSettings).values({ id: 1, adminPasswordHash: newHash });
  }

  // Self-verify without revealing anything.
  const verified = await verifyAdminPassword(target.trim());

  return NextResponse.json({
    ok: verified,
    message: verified
      ? "Admin password has been reset to the value of ADMIN_PASSWORD. Sign in at /admin, then remove ADMIN_RESET_KEY from the environment."
      : "Reset was written but verification failed. Check server logs.",
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { resetKey?: string };
  return handleReset(request, body.resetKey || "");
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key") || "";
  return handleReset(request, key);
}
