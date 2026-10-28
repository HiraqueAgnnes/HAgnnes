/** Authorization comes only from the explicit Acesso column, never inferred Função. */
export function canDeleteEvent(access:unknown){return access==='Secretaria'||access==='Master';}
export function eventDeletionStatements(id:string,version:number,actor:string,auditId:string,now:number){
 const guard="EXISTS (SELECT 1 FROM portal_events e WHERE e.id=? AND e.version=? AND NOT EXISTS (SELECT 1 FROM portal_opos o WHERE json_array_length(o.payload,'$.eventIds')>1 AND (o.event_id=e.id OR EXISTS (SELECT 1 FROM json_each(o.payload,'$.eventIds') linked WHERE linked.value=e.id))))";
 return [
  ...['portal_files','portal_intelligence','portal_reference_work','portal_opos'].map(table=>({sql:`DELETE FROM ${table} WHERE event_id=? AND ${guard}`,args:[id,id,version]})),
  {sql:`INSERT INTO portal_audit (id,event_id,actor,action,created) SELECT ?,?,?,?,? WHERE ${guard}`,args:[auditId,id,actor,'event:delete',now,id,version]},
  {sql:`DELETE FROM portal_events WHERE id=? AND ${guard}`,args:[id,id,version]}
 ];
}
