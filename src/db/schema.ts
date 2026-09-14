import {
  pgSchema,
  serial,
  text,
  timestamp,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

export const flowcrm = pgSchema("flowcrm");

export const contacts = flowcrm.table("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deals = flowcrm.table("deals", {
  id: serial("id").primaryKey(),

  title: text("title").notNull(),

  contactId: integer("contact_id")
    .references(() => contacts.id)
    .notNull(),

  value: numeric("value", {
    precision: 12,
    scale: 2,
  }).notNull(),

  stage: text("stage").notNull().default("new"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = flowcrm.table("activities", {
  id: serial("id").primaryKey(),

  type: text("type").notNull(),

  message: text("message").notNull(),

  entityType: text("entity_type"),

  entityId: integer("entity_id"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});