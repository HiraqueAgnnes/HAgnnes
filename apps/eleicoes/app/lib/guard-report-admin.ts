import 'server-only';
import {env} from 'cloudflare:workers';
import {configuredCpfs} from './private-permissions';
export const guardReportAdministrators={
  has(cpf:string){return configuredCpfs(env as unknown as Record<string,unknown>,'ELECTION_GUARD_ADMIN_CPFS').has(cpf);},
};
