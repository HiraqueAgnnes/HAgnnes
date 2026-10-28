// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const enemRecords=sqliteTable('portal_enem_records',{
 id:text('id').primaryKey(),kind:text('kind').notNull(),year:integer('year').notNull(),payload:text('payload').notNull(),
 updated:integer('updated').notNull(),actor:text('actor').notNull(),version:integer('version').notNull().default(1)
});
export const enemDuty=sqliteTable('portal_enem_duty',{
 id:text('id').primaryKey(),year:integer('year').notNull(),day:integer('day').notNull(),location:text('location').notNull(),slot:integer('slot').notNull(),
 soldier:text('soldier').notNull(),payload:text('payload').notNull(),updated:integer('updated').notNull(),actor:text('actor').notNull(),version:integer('version').notNull().default(1)
},table=>[uniqueIndex('enem_duty_slot').on(table.year,table.day,table.location,table.slot),uniqueIndex('enem_duty_soldier').on(table.year,table.day,table.soldier)]);
export const sessions = sqliteTable('portal_sessions', { id:text('id').primaryKey(), owner:text('owner').notNull(), profile:text('profile').notNull(), expires:integer('expires').notNull() });
export const events = sqliteTable('portal_events', { id:text('id').primaryKey(), payload:text('payload').notNull(), created:integer('created').notNull(), updated:integer('updated').notNull(), version:integer('version').notNull().default(1) });
export const files = sqliteTable('portal_files', { id:text('id').primaryKey(), eventId:text('event_id').notNull(), name:text('name').notNull(), kind:text('kind').notNull(), storageKey:text('storage_key').notNull(), bytes:integer('bytes').notNull(), created:integer('created').notNull() });
export const limits=sqliteTable('portal_login_limits',{id:text('id').primaryKey(),attempts:integer('attempts').notNull(),expires:integer('expires').notNull()});
export const audit=sqliteTable('portal_audit',{id:text('id').primaryKey(),eventId:text('event_id').notNull(),actor:text('actor').notNull(),action:text('action').notNull(),created:integer('created').notNull()});
export const visits=sqliteTable('portal_visits',{id:text('id').primaryKey(),created:integer('created').notNull()});
export const presence=sqliteTable('portal_presence',{sessionId:text('session_id').primaryKey(),lastSeen:integer('last_seen').notNull()});
export const intelligence=sqliteTable('portal_intelligence',{
 eventId:text('event_id').primaryKey(),content:text('content').notNull().default(''),fileId:text('file_id'),
 sentContent:text('sent_content'),sentFileId:text('sent_file_id'),sentAt:integer('sent_at'),
 updated:integer('updated').notNull(),actor:text('actor').notNull(),version:integer('version').notNull().default(1)
});
export const referenceWork=sqliteTable('portal_reference_work',{
 id:text('id').primaryKey(),eventId:text('event_id').notNull(),typeId:integer('type_id').notNull(),payload:text('payload').notNull(),
 updated:integer('updated').notNull(),actor:text('actor').notNull(),version:integer('version').notNull().default(1)
});
export const conductTerms=sqliteTable('portal_conduct_terms',{
 id:text('id').primaryKey(),category:text('category').notNull(),subject:text('subject').notNull(),date:text('date').notNull(),status:text('status').notNull(),
 filename:text('filename').notNull(),storageKey:text('storage_key').notNull(),bytes:integer('bytes').notNull(),
 created:integer('created').notNull(),updated:integer('updated').notNull(),actor:text('actor').notNull(),version:integer('version').notNull().default(1)
});
export const operations=sqliteTable('portal_operations',{
 id:text('id').primaryKey(),opoNumber:text('opo_number'),repeatUntil:text('repeat_until'),modelId:text('model_id'),name:text('name').notNull(),date:text('date').notNull(),endDate:text('end_date').notNull(),
 unit:text('unit').notNull(),startTime:text('start_time').notNull(),endTime:text('end_time').notNull(),
 created:integer('created').notNull(),updated:integer('updated').notNull(),actor:text('actor').notNull(),version:integer('version').notNull().default(1)
});

export const operationModels=sqliteTable('portal_operation_models',{
 id:text('id').primaryKey(),name:text('name').notNull(),nameKey:text('name_key').notNull().unique(),objective:text('objective').notNull(),
 vehicles:integer('vehicles').notNull(),type:text('type').notNull(),employment:text('employment').notNull(),
 created:integer('created').notNull(),updated:integer('updated').notNull(),actor:text('actor').notNull(),version:integer('version').notNull().default(1)
});
export const opos=sqliteTable('portal_opos',{
 id:text('id').primaryKey(),number:text('number').notNull(),classification:text('classification').notNull(),employment:text('employment').notNull(),name:text('name').notNull(),
 eventId:text('event_id').unique(),operationId:text('operation_id').unique(),payload:text('payload').notNull(),filename:text('filename').notNull(),storageKey:text('storage_key').notNull(),bytes:integer('bytes').notNull(),
 created:integer('created').notNull(),updated:integer('updated').notNull(),actor:text('actor').notNull(),version:integer('version').notNull().default(1)
});
