import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {existsSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';

globalThis.privateSourceTest = {env: {}, rows: [], token: null, requests: []};
const state = globalThis.privateSourceTest;
const appRoot = new URL('../apps/eleicoes/', import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    if (['server-only', 'cloudflare:workers', 'xlsx', 'next/headers'].includes(specifier)) return {url: `mock:${specifier}`, shortCircuit: true};
    if (specifier.startsWith('@/')) specifier = new URL(specifier.slice(2), appRoot).href;
    if (context.parentURL?.startsWith(appRoot.href) && (specifier.startsWith('.') || specifier.startsWith('file:'))) {
      const url = new URL(specifier, context.parentURL);
      if (existsSync(fileURLToPath(url) + '.ts')) return {url: url.href + '.ts', shortCircuit: true};
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    const source = {
      'mock:server-only': '',
      'mock:cloudflare:workers': 'export const env=globalThis.privateSourceTest.env;',
      'mock:xlsx': 'export const read=()=>({Sheets:{Planilha1:{}},SheetNames:["Planilha1"]});export const utils={sheet_to_json:()=>globalThis.privateSourceTest.rows};',
      'mock:next/headers': 'export const cookies=async()=>({get:()=>({value:globalThis.privateSourceTest.token})});',
    }[url];
    return source === undefined ? next(url, context) : {format: 'module', source, shortCircuit: true};
  },
});
globalThis.fetch = async (url, options) => {
  state.requests.push({url: String(url), options});
  return new Response(new Uint8Array([80, 75]));
};
const auth = await import('../apps/eleicoes/app/lib/auth.ts');
const gateway = await import('../apps/eleicoes/app/api/private-source/route.ts');
let version = 0;
function directory(rows) {
  state.rows = rows;
  state.env.ELECTION_LOGIN_URL = `https://example.invalid/directory-${++version}.xlsx`;
}
const user = {CPF:'00000000001', SENHA:'synthetic-password', POSTO:'TESTE', 'NOME DE GUERRA':'PESSOA SINTÉTICA', OPM:'TESTE', ACESSO:'Área de Policiamento Eleitoral 1'};
async function session() {
  state.env.APP_SESSION_SECRET = 'synthetic-test-secret-not-for-production';
  state.token = await auth.createSession({cpf:user.CPF,posto:'TESTE',nome:'PESSOA SINTÉTICA',opm:'TESTE',acesso:user.ACESSO,loginAt:Date.now(),logId:'synthetic',exp:Date.now()+60000});
}
test('autenticação usa fonte privada, atualiza configuração e recusa CPF duplicado', async () => {
  delete state.env.ELECTION_LOGIN_URL;
  await assert.rejects(auth.authenticate(user.CPF, user.SENHA), /ELECTION_LOGIN_URL/);
  directory([user]);
  assert.equal((await auth.authenticate(user.CPF,user.SENHA)).nome,user['NOME DE GUERRA']);
  assert.equal(await auth.authenticate(user.CPF,'wrong'),null);
  assert.equal(state.requests.at(-1).options.cache,'no-store');
  directory([{...user,SENHA:'changed'}]);
  assert.equal(await auth.authenticate(user.CPF,user.SENHA),null);
  assert.ok(await auth.authenticate(user.CPF,'changed'));
  directory([user,{...user,SENHA:'duplicate'}]);
  assert.equal(await auth.authenticate(user.CPF,user.SENHA),null);
  assert.equal(await auth.currentAccess(user.CPF),null);
});
test('sessão assinada recusa adulteração e expiração', async () => {
  await session();
  assert.equal((await auth.readSession(state.token)).cpf,user.CPF);
  assert.equal(await auth.readSession(state.token+'0'),null);
  assert.equal(await auth.readSession(state.token+'.extra'),null);
  assert.equal(await auth.readSession(await auth.createSession({exp:Date.now()-1})),null);
});
test('links exigem sessão e acesso atual; destino conserva parâmetros de inserção', async () => {
  const request = name => new Request('https://portal.test/api/private-source?name='+name);
  state.token=null;
  assert.equal((await gateway.GET(request('ELECTION_VOTE_2_EDIT_URL'))).status,401);
  await session();
  directory([{...user,ACESSO:''}]);
  assert.equal((await gateway.GET(request('ELECTION_VOTE_2_EDIT_URL'))).status,403);
  directory([user]);
  for (const name of ['ELECTION_LOGIN_URL','ELECTION_WORKBOOK_1_URL','ELECTION_WORKBOOK_2_URL','UNKNOWN','https://example.invalid']) assert.equal((await gateway.GET(request(name))).status,404);
  assert.equal((await gateway.GET(request('ELECTION_VOTE_2_EDIT_URL'))).status,403);
  directory([{...user,ACESSO:'Todas Áreas de Policiamento'}]);
  assert.equal((await gateway.GET(request('ELECTION_VOTE_2_EDIT_URL'))).status,503);
  const target='https://example.invalid/scale?mode=edit&upload=1&token=synthetic';
  state.env.ELECTION_VOTE_2_EDIT_URL=target;
  const response=await gateway.GET(request('ELECTION_VOTE_2_EDIT_URL'));
  assert.equal(response.status,302);
  assert.equal(response.headers.get('Location'),target);
  assert.equal(response.headers.get('Cache-Control'),'private, no-store');
  assert.equal(response.headers.get('Referrer-Policy'),'no-referrer');
});
