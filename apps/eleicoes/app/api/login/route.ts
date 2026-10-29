import {SourceConfigurationError} from "@/app/lib/private-sources";
import { NextResponse } from "next/server";
import { authenticate, createSession } from "@/app/lib/auth";
import { getDb } from "@/db";
import { accessLogs } from "@/db/schema";

export async function POST(request: Request) {
  const { cpf = "", senha = "" } = await request.json().catch(() => ({})) as {cpf?: unknown; senha?: unknown};
  let user;
  try { user = await authenticate(String(cpf), String(senha)); }
  catch (error) {
    if (error instanceof SourceConfigurationError) return NextResponse.json({error: "Fonte de acesso não configurada."}, {status: 503});
    throw error;
  }
  if (!user) return NextResponse.json({ error: "CPF ou senha inválidos." }, { status: 401 });
  const now = Date.now();
  const logId = crypto.randomUUID();
  await getDb().insert(accessLogs).values({ id: logId, cpf: user.cpf, enteredAt: now, lastSeenAt: now, minutes: 0 });
  const token = await createSession({ ...user, loginAt: now, logId, exp: now + 12 * 60 * 60 * 1000 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("eleicoes_session", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 43200 });
  return response;
}
