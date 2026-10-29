export type ElectionTurn = "1" | "2";
export const electionCookie = "cprm_election_turn";
export const elections = {
  "1": { turn: "1", label: "1º Turno", guardDate: "2026-10-03", voteDate: "2026-10-04", period: "03 e 04/10/2026", archived: true },
  "2": { turn: "2", label: "2º Turno", guardDate: "2026-10-24", voteDate: "2026-10-25", period: "24 e 25/10/2026", archived: false },
} as const;
export function electionTurn(value: unknown): ElectionTurn { return value === "1" ? "1" : "2"; }
export function electionDates(turn: ElectionTurn): string[] { return [elections[turn].guardDate, elections[turn].voteDate]; }
export const electionTables = ["vehicle_assignments", "officer_reports", "guard_sector_reports", "vote_sector_reports", "report_availability", "copom_records"] as const;
export function electionSql(sql: string, turn: ElectionTurn) {
  if (turn === "1" && !/^\s*SELECT\b/i.test(sql)) throw Error("O 1º turno está arquivado e disponível apenas para consulta.");
  return turn === "1" ? sql : sql.replace(new RegExp(`\\b(${electionTables.join("|")})\\b`, "g"), "$1_t2");
}
