import crypto from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const ADMIN_COOKIE_NAME = "damascus_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL;
  if (!secret) {
    throw new Error("Server session secret is not configured");
  }
  return secret;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyHashedPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [salt, hexHash] = parts;
  const expected = Buffer.from(hexHash, "hex");
  const actual = crypto.scryptSync(password, salt, 64);
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  if (!candidate || candidate.length > 200) return false;

  const [settings] = await db
    .select({ adminPasswordHash: storeSettings.adminPasswordHash })
    .from(storeSettings)
    .where(eq(storeSettings.id, 1))
    .limit(1);

  if (settings?.adminPasswordHash) {
    return verifyHashedPassword(candidate, settings.adminPasswordHash);
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) {
    return false;
  }

  const a = crypto.createHash("sha256").update(candidate).digest();
  const b = crypto.createHash("sha256").update(envPassword).digest();
  return crypto.timingSafeEqual(a, b);
}

export function createSignedAdminToken(): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const nonce = crypto.randomBytes(12).toString("hex");
  const payload = `admin.${exp}.${nonce}`;
  const sig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifySignedAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [role, expRaw, nonce, sig] = parts;
  if (role !== "admin" || !nonce || !sig) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;

  const payload = `${role}.${expRaw}.${nonce}`;
  const expectedSig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  const sigBuf = Buffer.from(sig, "hex");
  const expBuf = Buffer.from(expectedSig, "hex");
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  return verifySignedAdminToken(token);
}
