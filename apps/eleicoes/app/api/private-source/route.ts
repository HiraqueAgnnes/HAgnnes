import { cookies } from 'next/headers';
import { env } from 'cloudflare:workers';
import { readSession, currentAccess } from '@/app/lib/auth';
import { privateSourceUrl, sourceNames, type SourceName } from '@/app/lib/private-sources';
import {canReadAreaSchedule} from '@/app/lib/area-access';

const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' };
export async function GET(request: Request) {
  const session = await readSession((await cookies()).get('eleicoes_session')?.value);
  if (!session) return Response.json({error: 'Sessão inválida.'}, {status: 401, headers});
  // Revalidate the directory rather than trusting a possibly revoked session.
  const access = await currentAccess(session.cpf);
  if (!access) return Response.json({error: 'Acesso revogado ou indisponível.'}, {status: 403, headers});
  const name = new URL(request.url).searchParams.get('name') as SourceName;
  if (!sourceNames.includes(name) || name === 'ELECTION_LOGIN_URL' || name.startsWith('ELECTION_WORKBOOK_')) {
    return Response.json({error: 'Fonte não permitida.'}, {status: 404, headers});
  }
  if (name.includes('_EDIT_') && !Array.from({length:9}, (_,i)=>i+1).every(area=>canReadAreaSchedule(access,area))) {
    return Response.json({error: 'Acesso não autorizado.'}, {status: 403, headers});
  }
  try {
    return new Response(null, {status: 302, headers: {...headers, Location: privateSourceUrl(env as unknown as Record<string, unknown>, name)}});
  } catch {
    return Response.json({error: 'Fonte não configurada.'}, {status: 503, headers});
  }
}
