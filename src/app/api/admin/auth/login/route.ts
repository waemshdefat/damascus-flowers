import { NextResponse } from "next/server";
import { ensureSeeded } from "@/db/seed";
import {
  ADMIN_COOKIE_NAME,
  createSignedAdminToken,
  verifyAdminPassword,
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`admin-login:${ip}`, 8, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "محاولات دخول متكررة. يرجى الانتظار دقيقة والمحاولة مجددًا." },
      { status: 429 }
    );
  }

  await ensureSeeded();
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const valid = await verifyAdminPassword(body.password || "");
  if (!valid) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور غير صحيحة." },
      { status: 401 }
    );
  }

  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    request.url.startsWith("https://");

  const token = createSignedAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
