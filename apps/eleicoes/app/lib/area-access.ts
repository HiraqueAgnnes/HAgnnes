const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function canReadAreaSchedule(access: string, area: number) {
  const value = normalize(access);
  if (/todas\s+areas\s+de\s+policiamento/.test(value)) return true;
  return [...value.matchAll(/area\s+de\s+policiamento\s+eleitoral\s+(\d+)\b/g)].some(match => Number(match[1]) === area);
}
