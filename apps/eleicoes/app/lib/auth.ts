import "server-only";
import {privateSourceUrl, SourceConfigurationError} from "./private-sources";
import { env } from "cloudflare:workers";
import * as XLSX from "xlsx";
import { nextRefresh } from "@/app/lib/refresh-time";


type OnlineUser = { cpf: string; senha: string; posto: string; nome: string; opm: string; acesso: string };
let loginCache: { users: OnlineUser[]; expiresAt: Date; sourceUrl: string } | null = null;

const clean = (value: unknown) => String(value ?? "").replace(/\s+/g, " ").trim();
const onlyDigits = (value: unknown) => clean(value).replace(/\D/g, "");

async function onlineUsers() {
  const sourceUrl = privateSourceUrl(env as unknown as Record<string, unknown>, "ELECTION_LOGIN_URL");
  const now = new Date();
  if (loginCache && loginCache.sourceUrl === sourceUrl && now < loginCache.expiresAt) return loginCache.users;
  const response = await fetch(sourceUrl, { cache: "no-store", headers: { "User-Agent": "CPRM-Eleicoes-2026/1.0" } });
  if (!response.ok) throw new Error(`Falha ao atualizar a relação de login (${response.status})`);
  const workbook = XLSX.read(await response.arrayBuffer(), { type: "array" });
  const sheet = workbook.Sheets["Planilha1"] || workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
  const refreshed = rows.map(row => ({
    cpf: onlyDigits(row.CPF), senha: clean(row.SENHA), posto: clean(row.POSTO), nome: clean(row["NOME DE GUERRA"]),
    opm: clean(row.OPM), acesso: clean(row.ACESSO),
  })).filter(user => user.cpf.length === 11 && user.senha);
  if (!refreshed.length) throw new Error("A relação de login está vazia.");
  loginCache = { users: refreshed, sourceUrl, expiresAt: nextRefresh(now) };
  return refreshed;
}

const encoder = new TextEncoder();
const toHex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
const b64url = (value: string) => btoa(unescape(encodeURIComponent(value))).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const fromB64url = (value: string) => decodeURIComponent(escape(atob(value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4))));

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export type Session = { cpf: string; posto: string; nome: string; opm: string; acesso: string; loginAt: number; logId: string; exp: number };

export async function authenticate(cpfInput: string, password: string) {
  const cpf = cpfInput.replace(/\D/g, "");
  if (cpf.length !== 11 || !password) return null;
  try {
    const matches = (await onlineUsers()).filter(item => item.cpf === cpf);
    const user = matches.length === 1 ? matches[0] : null;
    if (user && constantTimeEqual(password.trim(), user.senha)) {
      return { cpf, posto: user.posto, nome: user.nome, opm: user.opm, acesso: user.acesso };
    }
  } catch (error) {
    if (error instanceof SourceConfigurationError) throw error;
    // Fail closed when the private directory cannot be refreshed.
  }
  return null;
}

async function signingKey() {
  const secret = env.APP_SESSION_SECRET;
  if (!secret) throw new Error("APP_SESSION_SECRET não configurado");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSession(payload: Session) {
  const body = b64url(JSON.stringify(payload));
  const sig = await crypto.subtle.sign("HMAC", await signingKey(), encoder.encode(body));
  return `${body}.${toHex(sig)}`;
}

export async function readSession(token?: string | null): Promise<Session | null> {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [body, sigText] = parts;
    if (!body || !sigText) return null;
    if (!/^[0-9a-f]{64}$/i.test(sigText)) return null;
    const sig = new Uint8Array(sigText.match(/.{2}/g)!.map((value) => parseInt(value, 16)));
    if (!(await crypto.subtle.verify("HMAC", await signingKey(), sig, encoder.encode(body)))) return null;
    const payload = JSON.parse(fromB64url(body)) as Session;
    return payload.exp > Date.now() ? payload : null;
  } catch { return null; }
}

export async function currentAccess(cpf: string): Promise<string | null> {
  try { const matches = (await onlineUsers()).filter(user => user.cpf === cpf); return matches.length === 1 ? matches[0].acesso : null; }
  catch { return null; }
}
