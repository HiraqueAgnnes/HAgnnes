import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const accessLogs = sqliteTable("access_logs", {
  id: text("id").primaryKey(),
  cpf: text("cpf").notNull(),
  enteredAt: integer("entered_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
  endedAt: integer("ended_at"),
  minutes: integer("minutes").notNull().default(0),
});

export const vehicleAssignments = sqliteTable("vehicle_assignments", {
  id: text("id").primaryKey(),
  task: text("task").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  area: text("area").notNull(),
  setor: text("setor").notNull(),
  base: text("base").notNull(),
  type: text("type").notNull(),
  model: text("model").notNull(),
  plate: text("plate").notNull(),
  updatedBy: text("updated_by").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const officerReports = sqliteTable("officer_reports", {
  cpf: text("cpf").primaryKey(),
  posto: text("posto").notNull(),
  nome: text("nome").notNull(),
  junta: text("junta").notNull(),
  zona: text("zona").notNull(),
  answers: text("answers").notNull(),
  submittedAt: text("submitted_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const guardSectorReports = sqliteTable("guard_sector_reports", {
 id:text("id").primaryKey(),cpf:text("cpf").notNull(),area:text("area").notNull(),setor:text("setor").notNull(),posto:text("posto").notNull(),nome:text("nome").notNull(),answers:text("answers").notNull(),attendance:text("attendance").notNull(),submittedAt:text("submitted_at").notNull(),updatedAt:text("updated_at").notNull(),
});

export const voteSectorReports = sqliteTable("vote_sector_reports", {
 id:text("id").primaryKey(),cpf:text("cpf").notNull(),area:text("area").notNull(),setor:text("setor").notNull(),posto:text("posto").notNull(),nome:text("nome").notNull(),answers:text("answers").notNull(),attendance:text("attendance").notNull(),submittedAt:text("submitted_at").notNull(),updatedAt:text("updated_at").notNull(),
});

export const reportAvailability=sqliteTable("report_availability",{kind:text("kind").primaryKey(),enabled:integer("enabled").notNull(),updatedBy:text("updated_by").notNull(),updatedAt:text("updated_at").notNull()});

export const copomRecords=sqliteTable("copom_records",{
 id:text("id").primaryKey(),kind:text("kind").notNull(),date:text("date").notNull(),time:text("time").notNull(),city:text("city").notNull(),neighborhood:text("neighborhood").notNull(),opm:text("opm").notNull(),crime:text("crime").notNull(),solution:text("solution").notNull(),referral:text("referral").notNull(),createdBy:text("created_by").notNull(),createdAt:text("created_at").notNull(),updatedBy:text("updated_by").notNull(),updatedAt:text("updated_at").notNull(),
});

export const vehicleAssignmentsTurn2 = sqliteTable("vehicle_assignments_t2", {
  id: text("id").primaryKey(),
  task: text("task").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  area: text("area").notNull(),
  setor: text("setor").notNull(),
  base: text("base").notNull(),
  type: text("type").notNull(),
  model: text("model").notNull(),
  plate: text("plate").notNull(),
  updatedBy: text("updated_by").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const officerReportsTurn2 = sqliteTable("officer_reports_t2", {
  cpf: text("cpf").primaryKey(),
  posto: text("posto").notNull(),
  nome: text("nome").notNull(),
  junta: text("junta").notNull(),
  zona: text("zona").notNull(),
  answers: text("answers").notNull(),
  submittedAt: text("submitted_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const guardSectorReportsTurn2 = sqliteTable("guard_sector_reports_t2", {
 id:text("id").primaryKey(),cpf:text("cpf").notNull(),area:text("area").notNull(),setor:text("setor").notNull(),posto:text("posto").notNull(),nome:text("nome").notNull(),answers:text("answers").notNull(),attendance:text("attendance").notNull(),submittedAt:text("submitted_at").notNull(),updatedAt:text("updated_at").notNull(),
});

export const voteSectorReportsTurn2 = sqliteTable("vote_sector_reports_t2", {
 id:text("id").primaryKey(),cpf:text("cpf").notNull(),area:text("area").notNull(),setor:text("setor").notNull(),posto:text("posto").notNull(),nome:text("nome").notNull(),answers:text("answers").notNull(),attendance:text("attendance").notNull(),submittedAt:text("submitted_at").notNull(),updatedAt:text("updated_at").notNull(),
});

export const reportAvailabilityTurn2 = sqliteTable("report_availability_t2",{kind:text("kind").primaryKey(),enabled:integer("enabled").notNull(),updatedBy:text("updated_by").notNull(),updatedAt:text("updated_at").notNull()});

export const copomRecordsTurn2 = sqliteTable("copom_records_t2",{
 id:text("id").primaryKey(),kind:text("kind").notNull(),date:text("date").notNull(),time:text("time").notNull(),city:text("city").notNull(),neighborhood:text("neighborhood").notNull(),opm:text("opm").notNull(),crime:text("crime").notNull(),solution:text("solution").notNull(),referral:text("referral").notNull(),createdBy:text("created_by").notNull(),createdAt:text("created_at").notNull(),updatedBy:text("updated_by").notNull(),updatedAt:text("updated_at").notNull(),
});

// Independent per-location attendance; only the second election turn can write.
export const attendanceChecksTurn2=sqliteTable("attendance_checks_t2",{
 id:text("id").primaryKey(),service:text("service").notNull(),assignmentId:text("assignment_id").notNull(),locationId:text("location_id").notNull(),cpf:text("cpf").notNull(),area:text("area").notNull(),setor:text("setor").notNull(),nome:text("nome").notNull(),posto:text("posto").notNull(),attendance:text("attendance").notNull(),revision:integer("revision").notNull(),updatedAt:text("updated_at").notNull(),
});
