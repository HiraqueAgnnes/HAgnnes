export type PermissionSetting = 'ELECTION_REPORT_ADMIN_CPFS' | 'ELECTION_GUARD_ADMIN_CPFS' | 'ELECTION_AVAILABILITY_OWNER_CPF';
export function configuredCpfs(settings: Record<string,unknown>, name: PermissionSetting): ReadonlySet<string> {
  const raw=settings[name];
  if(typeof raw!=='string'||!raw.trim())return new Set();
  const values=raw.split(',').map(value=>value.trim());
  // Reject the complete invalid configuration rather than broadening access.
  if(values.some(value=>!/^\d{11}$/.test(value)||/^0{11}$/.test(value)))throw Error(`Configuração privada inválida: ${name}`);
  if(name==='ELECTION_AVAILABILITY_OWNER_CPF'&&values.length!==1)throw Error(`Configuração privada inválida: ${name}`);
  return new Set(values);
}
