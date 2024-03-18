import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';


export const mission = sqliteTable('mission', {
  id: integer('id').primaryKey().notNull(),
})

export const character = sqliteTable('character', {
  id: integer('id').primaryKey().notNull(),
  name: text('name').notNull(),
  img: text('img').notNull(),
})

export const dialog = sqliteTable('dialog', {
    id: integer('id').primaryKey().notNull(),
    missionId: integer('mission_id').notNull().references(() => mission.id),
    order: real('order').notNull(),
    character: text('character').notNull().references(()=>character.id),
    speech: text('speech').notNull(),
    createdAt: text("timestamp").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const response = sqliteTable('response', {
    id: integer('id').primaryKey().notNull(),
    dialogID: integer('dialog_id').notNull().references(()=>dialog.id),
    response: text('text').notNull(),
})
