import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('../apps/eleicoes/',import.meta.url);
const state=globalThis.workbookTest={env:{},turn:'2',requests:[],failure:false,books:{}};
registerHooks({
  resolve(specifier,context,next){
    if(['server-only','cloudflare:workers','xlsx','next/headers'].includes(specifier))return {url:'mock:'+specifier,shortCircuit:true};
    if(specifier.startsWith('@/'))specifier=new URL(specifier.slice(2),root).href;
    if(context.parentURL?.startsWith(root.href)&&(specifier.startsWith('.')||specifier.startsWith('file:'))){
      const url=new URL(specifier,context.parentURL);if(existsSync(fileURLToPath(url)+'.ts'))return {url:url.href+'.ts',shortCircuit:true};
    }
    return next(specifier,context);
  },
  load(url,context,next){
    const source={
      'mock:server-only':'',
      'mock:cloudflare:workers':'export const env=globalThis.workbookTest.env;',
      'mock:next/headers':'export const cookies=async()=>({get:()=>({value:globalThis.workbookTest.turn})});',
      'mock:xlsx':'export const read=bytes=>JSON.parse(new TextDecoder().decode(bytes));export const utils={sheet_to_json:sheet=>sheet};',
    }[url];
    return source===undefined?next(url,context):{format:'module',source,shortCircuit:true};
  },
});
globalThis.fetch=async(url,options)=>{
  state.requests.push({url,options});
  if(state.failure)throw Error('synthetic outage');
  return new Response(JSON.stringify(state.books[url]));
};
const {getElectionWorkbook}=await import('../apps/eleicoes/app/lib/election-workbook.ts');
const {electionSql}=await import('../apps/eleicoes/app/lib/election-config.ts');
function book(name,turn='2'){
  const date=turn==='1'?'2026-10-03':'2026-10-24';
  return {Sheets:{
    'Efetivo Geral':[['CPF','NOME COMPLETO'],['00000000001','PESSOA SINTÉTICA']],
    'Escala do Motorizado':[['FUNCAO'],['Comandante de Setor']],
    'Escala Guarda Urna':[['NOME DO LOCAL','DATA INICIAL'],[name,date]],
    'Escala Dia de Votação':[['NOME DO LOCAL','DATA INICIAL'],[name,turn==='1'?'2026-10-04':'2026-10-25']],
    'Locais':[['NOME DO LOCAL DE VOTACAO','ZONA','COD DO LOCAL','CIDADE','AREA','SETOR'],[name,1,1,'Cidade sintética',1,1]],
    'TRE':[['SECAO','ZONA.NUM','COD DO LOCAL','NOME DO LOCAL','NUMERO DE ELEITORES APTOS'],[1,1,1,name,10]],
  }};
}
test('escala continua consultada pelo link privado, compartilha atualização e isola turnos',async()=>{
  state.env.ELECTION_WORKBOOK_1_URL='https://example.invalid/turn-1.xlsx';
  state.env.ELECTION_WORKBOOK_2_URL='https://example.invalid/turn-2.xlsx?download=1';
  state.books[state.env.ELECTION_WORKBOOK_1_URL]=book('LOCAL HISTÓRICO','1');
  state.books[state.env.ELECTION_WORKBOOK_2_URL]=book('LOCAL ATUAL');
  const before=state.requests.length;
  const [a,b]=await Promise.all([getElectionWorkbook('2'),getElectionWorkbook('2')]);
  assert.equal(state.requests.length,before+1);
  assert.strictEqual(a.workbook,b.workbook);
  assert.equal(a.stale,false);assert.deepEqual(a.warnings,[]);
  assert.equal(state.requests.at(-1).options.cache,'no-store');
  assert.ok(state.requests.at(-1).options.signal);
  const old=await getElectionWorkbook('1');
  assert.equal(old.workbook.Sheets.Locais[1][0],'LOCAL HISTÓRICO');
  assert.equal(a.workbook.Sheets.Locais[1][0],'LOCAL ATUAL');
  assert.throws(()=>electionSql('INSERT INTO copom_records VALUES (?)','1'),/arquivado/);
  assert.equal(electionSql('SELECT * FROM copom_records','2'),'SELECT * FROM copom_records_t2');
});
test('nova URL invalida cache; falha não usa dados fictícios nem dados da outra fonte',async()=>{
  state.env.ELECTION_WORKBOOK_2_URL='https://example.invalid/revised.xlsx';
  state.books[state.env.ELECTION_WORKBOOK_2_URL]=book('LOCAL REVISADO');
  assert.equal((await getElectionWorkbook('2')).workbook.Sheets.Locais[1][0],'LOCAL REVISADO');
  state.env.ELECTION_WORKBOOK_2_URL='https://example.invalid/not-configured.xlsx';
  state.failure=true;
  await assert.rejects(getElectionWorkbook('2'),/nenhuma cópia validada/);
  state.failure=false;
});
test('atualização periódica lê edição feita no mesmo link e identifica indisponibilidade',async t=>{
  t.mock.timers.enable({apis:['Date'],now:new Date('2026-10-29T12:00:00Z').getTime()});
  try {
    state.env.ELECTION_WORKBOOK_2_URL='https://example.invalid/continuing.xlsx';
    state.books[state.env.ELECTION_WORKBOOK_2_URL]=book('ANTES DA EDIÇÃO');
    const a=await getElectionWorkbook('2');
    state.books[state.env.ELECTION_WORKBOOK_2_URL]=book('DEPOIS DA EDIÇÃO');
    t.mock.timers.setTime(a.expiresAt.getTime()+1);
    const b=await getElectionWorkbook('2');
    assert.equal(b.workbook.Sheets.Locais[1][0],'DEPOIS DA EDIÇÃO');
    state.failure=true;t.mock.timers.setTime(b.expiresAt.getTime()+1);
    const stale=await getElectionWorkbook('2');
    assert.equal(stale.stale,true);
    assert.equal(stale.workbook.Sheets.Locais[1][0],'DEPOIS DA EDIÇÃO');
    assert.ok(stale.warnings.some(w=>w.includes('indisponível')));
  } finally {state.failure=false;t.mock.timers.reset();}
});
test('configuração ausente falha antes de qualquer acesso externo',async()=>{
  delete state.env.ELECTION_WORKBOOK_2_URL;const requests=state.requests.length;
  await assert.rejects(getElectionWorkbook('2'),/ELECTION_WORKBOOK_2_URL/);
  assert.equal(state.requests.length,requests);
});
