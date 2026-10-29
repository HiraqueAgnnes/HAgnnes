import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { readSession } from "@/app/lib/auth";
import { getDb } from "@/db";
import { accessLogs } from "@/db/schema";

export async function POST() {
  const jar = await cookies();
  const session = await readSession(jar.get("eleicoes_session")?.value);
  if (session) {
    const now = Date.now();
    await getDb().update(accessLogs).set({ lastSeenAt: now, endedAt: now, minutes: Math.max(1, Math.ceil((now - session.loginAt) / 60000)) }).where(eq(accessLogs.id, session.logId));
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("eleicoes_session", "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
