import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  text,
  PgArray,
  varchar,
  pgEnum
} from "drizzle-orm/pg-core";

export const activityTable = pgTable(
  "activity",
  {
    id: serial("id").primaryKey(),
    from: timestamp("from_time").notNull(),
    to: timestamp("to_time").notNull(),
    activityName: varchar("activity_name", { length: 50 }).unique().notNull(),
    createdAt : timestamp("created_at").default(sql`now()`)
    
  },

);

export const commentTable = pgTable(
  "comment",
  {
    id: serial("id").primaryKey(),
    userName: varchar("user_Name", { length: 50 }).notNull(),
    createdAt : timestamp("created_at").default(sql`now()`),
    comment: varchar("comment", { length: 100 }).notNull(),
    activityId : serial("activity_id").references(() => activityTable.id),
    
  },
)

export const signStatusEnum = pgEnum("sign_status",["in","out"])
export const attendanceTable = pgTable(
  "attendance",
  {
    id: serial("id").primaryKey(),
    userName: varchar("user_Name", { length: 50 }).notNull(),
    createdAt : timestamp("created_at").default(sql`now()`),
    activityName: varchar("activity_Name", { length: 50 }).references(() => activityTable.activityName),
    signStatus : signStatusEnum("sign_status")
  }
);