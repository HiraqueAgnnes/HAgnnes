import 'server-only';
import {env} from 'cloudflare:workers';
import * as XLSX from 'xlsx';
import {activeElection} from './election-server';
import {elections, type ElectionTurn} from './election-config';
import {nextRefresh} from './refresh-time';
import {electionRows, workbookLocations} from './election-data';
import {privateSourceUrl} from './private-sources';

type Source={workbook:XLSX.WorkBook;fetchedAt:Date;expiresAt:Date;stale:boolean;warnings:string[]};
type Cached=Source & {sourceUrl:string};
const cache=new Map<ElectionTurn,Cached>();
const pending=new Map<string,Promise<Cached>>();
function validate(book:XLSX.WorkBook) {
  for(const [sheet,required] of [['Efetivo Geral','cpf'],['Escala do Motorizado','funcao'],['Escala Guarda Urna','nome do local'],['Escala Dia de Votação','nome do local'],['Locais','nome do local de votacao'],['TRE','secao']]) {
    if(!electionRows(book,sheet,required).length) throw Error(`Planilha ${sheet} vazia.`);
  }
  if(!workbookLocations(book).length)throw Error('Nenhum local de votação identificado.');
}
function warnings(book:XLSX.WorkBook,turn:ElectionTurn):string[] {
  if(turn==='1')return [];
  const result:string[]=[],config=elections[turn];
  for(const [sheet,date] of [['Escala Guarda Urna',config.guardDate],['Escala Dia de Votação',config.voteDate]]) {
    const dates=electionRows(book,sheet,'nome do local').filter(r=>r['nome do local']).map(r=>r['data inicial']).filter(Boolean);
    if(dates.some(value=>(value instanceof Date?value.toISOString().slice(0,10):typeof value==='number'?new Date(Date.UTC(1899,11,30)+value*86400000).toISOString().slice(0,10):String(value).slice(0,10))!==date)) result.push(`${sheet}: há datas diferentes de ${date.split('-').reverse().join('/')} na planilha. O portal utiliza a data do 2º turno definida pela coordenação.`);
  }
  return result;
}
export async function getElectionWorkbook(selectedTurn?:ElectionTurn):Promise<Source> {
  const config=selectedTurn?elections[selectedTurn]:await activeElection();
  const turn=config.turn;
  // Resolve on each request: changing a configured link invalidates its cache.
  const sourceUrl=privateSourceUrl(env as unknown as Record<string,unknown>,turn==='1'?'ELECTION_WORKBOOK_1_URL':'ELECTION_WORKBOOK_2_URL');
  const now=new Date(),entry=cache.get(turn),saved=entry?.sourceUrl===sourceUrl?entry:undefined;
  if(saved&&now<saved.expiresAt)return saved;
  const key=JSON.stringify([turn,sourceUrl]);
  const running=pending.get(key);if(running)return running;
  const work=(async():Promise<Cached>=>{
    try {
      const response=await fetch(sourceUrl,{cache:'no-store',signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw Error('Escala indisponível.');
      const bytes=await response.arrayBuffer();
      if(bytes.byteLength>25*1024*1024)throw Error('Escala excede o limite de leitura.');
      const book=XLSX.read(bytes,{type:'array',cellDates:true});validate(book);
      const data={workbook:book,fetchedAt:now,expiresAt:nextRefresh(now),stale:false,warnings:warnings(book,turn),sourceUrl};
      cache.set(turn,data);return data;
    } catch {
      // Never substitute public fixtures for an operational roster.
      if(!saved)throw Error('Escala privada indisponível e nenhuma cópia validada está em memória.');
      const data={...saved,expiresAt:new Date(Date.now()+60000),stale:true,warnings:[...warnings(saved.workbook,turn),'A atualização da planilha está indisponível. Exibindo a última cópia conferida; a consulta será tentada novamente.']};
      cache.set(turn,data);return data;
    }
  })();
  pending.set(key,work);
  try{return await work;}finally{pending.delete(key);}
}
