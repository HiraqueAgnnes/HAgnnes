export function canViewStatisticalRecords(access:unknown){return access==='Master'||access==='Planejamento';}
export function restrictStatisticalRecords<T extends {rows:unknown[];sourceUrl?:string}>(report:T,access:unknown){
 const canViewRecords=canViewStatisticalRecords(access);
 const {rows,sourceUrl,...aggregate}=report;
 return canViewRecords?{...aggregate,rows,...(sourceUrl?{sourceUrl}:{}),canViewRecords}:{...aggregate,canViewRecords};
}
