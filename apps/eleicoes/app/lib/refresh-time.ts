// Horários locais de Maceió (UTC−3), em intervalos de três horas a partir das 07h.
export function nextRefresh(now = new Date()): Date {
  const local = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const hour = local.getUTCHours();
  const nextHour = [1, 4, 7, 10, 13, 16, 19, 22].find((slot) => slot > hour);
  const day = nextHour === undefined ? local.getUTCDate() + 1 : local.getUTCDate();
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), day, (nextHour ?? 1) + 3));
}
