import * as XLSX from "xlsx";
import type { ElectionLocation } from "@/app/portal/election-context";
export const cleanElectionValue=(v:unknown)=>String(v??"").replace(/\s+/g," ").trim();
export const normalizeElectionValue=(v:unknown)=>cleanElectionValue(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export const electionNumber=(v:unknown)=>String(Number(cleanElectionValue(v).match(/\d+/)?.[0]||0));
export function electionRows(book:XLSX.WorkBook,sheet:string,required:string) {
  const source=book.Sheets[sheet];if(!source)throw Error(`Planilha ${sheet} indisponível.`);
  const matrix=XLSX.utils.sheet_to_json<unknown[]>(source,{header:1,defval:""});
  const index=matrix.findIndex(row=>row.some(v=>normalizeElectionValue(v)===required));
  if(index<0)throw Error(`Cabeçalho de ${sheet} indisponível.`);
  const names=matrix[index].map(normalizeElectionValue),seen=new Map<string,number>();
  const header=names.map(name=>{const n=(seen.get(name)||0)+1;seen.set(name,n);return n===1?name:`${name}__${n}`;});
  return matrix.slice(index+1).map(row=>Object.fromEntries(header.map((h,i)=>[h,row[i]??""])));
}
export function legacyElectionRows(book:XLSX.WorkBook,sheet:string) {
  const required:Record<string,string>={"Locais":"nome do local de votacao","TRE":"secao","Efetivo Geral":"cpf","Oficial de Ligação":"cmt da guarnicao","Escala do Motorizado":"funcao","Escala Guarda Urna":"nome do local","Escala Dia de Votação":"nome do local"};
  const source=book.Sheets[sheet];if(!source)throw Error(`Planilha ${sheet} indisponível.`);
  const matrix=XLSX.utils.sheet_to_json<unknown[]>(source,{header:1,defval:""});
  const index=matrix.findIndex(row=>row.some(v=>normalizeElectionValue(v)===required[sheet]));
  if(index<0)throw Error(`Cabeçalho de ${sheet} indisponível.`);
  return XLSX.utils.sheet_to_json<Record<string,unknown>>(source,{range:index,defval:""});
}
export function electionCpfIndex(book:XLSX.WorkBook) {
  const index=new Map<string,string>(),ambiguous=new Set<string>();
  for(const r of electionRows(book,"Efetivo Geral","cpf")){
    const name=normalizeElectionValue(r["nome completo"]),cpf=cleanElectionValue(r.cpf).replace(/\D/g,"").padStart(11,"0");
    if(!name||!/^\d{11}$/.test(cpf)||cpf==="00000000000")continue;
    if(index.has(name)&&index.get(name)!==cpf)ambiguous.add(name);else index.set(name,cpf);
  }
  for(const name of ambiguous)index.delete(name);
  return index;
}
export function workbookLocations(book:XLSX.WorkBook):ElectionLocation[] {
  type Detail={sections:Set<number>;voters:number};
  const byName=new Map<string,Detail>(),byCode=new Map<string,Detail>();
  for(const r of electionRows(book,"TRE","secao")) {
    const zona=electionNumber(r["zona.num"]||r["zona tre"]||r.zona),codigo=electionNumber(r["cod do local"]),section=Number(r.secao),voters=Number(r["numero de eleitores aptos"]||0),name=normalizeElectionValue(r["nome do local"]||r.local);
    if(zona==="0"||!Number.isInteger(section)||section<=0)continue;
    for(const [map,key] of [[byName,`${zona}:${name}`],[byCode,`${zona}:${codigo}`]] as const){const d=map.get(key)||{sections:new Set<number>(),voters:0};if(!d.sections.has(section)){d.sections.add(section);if(Number.isFinite(voters))d.voters+=voters;}map.set(key,d);}
  }
  const coordinate=(v:unknown)=>{const n=Number(cleanElectionValue(v).replace(",","."));return !cleanElectionValue(v)||!Number.isFinite(n)?"":Math.abs(n)>180?n/1e6:n;};
  return electionRows(book,"Locais","nome do local de votacao").flatMap(r=>{
    const nome=cleanElectionValue(r["nome do local de votacao"]),zona=electionNumber(r.zona),codigo=electionNumber(r["cod do local"]);
    if(!nome||nome.startsWith("#")||zona==="0")return [];
    const d=byName.get(`${zona}:${normalizeElectionValue(nome)}`)||byCode.get(`${zona}:${codigo}`),numerosSecoes=[...(d?.sections||[])].sort((a,b)=>a-b);
    return [{zona,codigo,nome,cidade:cleanElectionValue(r.cidade),endereco:cleanElectionValue(r.endereco),lat:coordinate(r.lat),lon:coordinate(r.lon),opm:cleanElectionValue(r.opm),bairro:cleanElectionValue(r.bairro),tipo:cleanElectionValue(r["tipo de local"]),area:electionNumber(r.area),setor:electionNumber(r.setor),secoes:numerosSecoes.length||Number(r["numero de secoes"]||0),eleitores:d?.voters??Number(r["numero de eleitores aptos"]||0),numerosSecoes}];
  });
}
