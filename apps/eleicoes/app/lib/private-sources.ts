// Shared identifiers are public; URL values exist only in the Worker environment.
export const sourceNames = [
  'ELECTION_LOGIN_URL', 'ELECTION_WORKBOOK_1_URL', 'ELECTION_WORKBOOK_2_URL',
  'ELECTION_SCALES_FOLDER_URL', 'ELECTION_GUARD_1_EDIT_URL', 'ELECTION_GUARD_2_EDIT_URL',
  'ELECTION_VOTE_1_EDIT_URL', 'ELECTION_VOTE_2_EDIT_URL',
  'ELECTION_OFFICER_1_EDIT_URL', 'ELECTION_OFFICER_2_EDIT_URL',
  'ELECTION_VEHICLES_1_EDIT_URL', 'ELECTION_VEHICLES_2_EDIT_URL',
] as const;
export type SourceName = typeof sourceNames[number];
export class SourceConfigurationError extends Error {
  readonly setting: SourceName;
  constructor(setting: SourceName) {
    super(`Fonte privada não configurada ou inválida: ${setting}`);
    this.name = 'SourceConfigurationError';
    this.setting = setting;
  }
}
export function privateSourceUrl(settings: Record<string, unknown>, name: SourceName): string {
  const raw = settings[name];
  if (typeof raw !== 'string' || !raw.trim()) throw new SourceConfigurationError(name);
  let url: URL;
  try { url = new URL(raw.trim()); } catch { throw new SourceConfigurationError(name); }
  if (url.protocol !== 'https:' || url.username || url.password) throw new SourceConfigurationError(name);
  // Preserve query parameters: they may carry the provider's edit/upload access.
  return url.href;
}
export function sourceLink(name: SourceName): string {
  return `/api/private-source?name=${encodeURIComponent(name)}`;
}
