import "server-only";
import { cookies } from "next/headers";
import { env } from "cloudflare:workers";
import { electionCookie, electionTurn, electionSql, elections } from "./election-config";
export async function activeElection() { return elections[electionTurn((await cookies()).get(electionCookie)?.value)]; }
export async function electionDB() {
  if (!env.DB) throw Error("Banco de dados indisponível.");
  const { turn } = await activeElection();
  return { prepare: (sql: string) => env.DB!.prepare(electionSql(sql, turn)) };
}
export async function archiveWriteError(request?:Request) {
  const config=await activeElection();
  if(request&&request.headers.get("X-Election-Turn")!==config.turn)return Response.json({error:"O turno foi alterado em outra aba ou a página está desatualizada. Recarregue o portal antes de enviar."},{status:409});
  return config.archived ? Response.json({ error: "O 1º turno está arquivado e disponível apenas para consulta. Selecione o 2º turno para registrar novos dados." }, { status: 403, headers: { "Cache-Control": "private, no-store" } }) : null;
}
