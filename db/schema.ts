import {index,integer,real,sqliteTable,text} from 'drizzle-orm/sqlite-core';

export const players=sqliteTable('players',{
 userId:text('user_id').primaryKey(),
 email:text('email').notNull(),
 displayName:text('display_name').notNull(),
 handle:text('handle').notNull(),
 saveJson:text('save_json').notNull().default(''),
 x:real('x').notNull().default(-8),z:real('z').notNull().default(22),yaw:real('yaw').notNull().default(0),
 pvpMode:text('pvp_mode').notNull().default('safe'),zone:text('zone'),health:real('health').notNull().default(100),
 kills:integer('kills').notNull().default(0),deaths:integer('deaths').notNull().default(0),lastAttackAt:integer('last_attack_at').notNull().default(0),
 createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull()
},t=>[index('idx_players_updated_at').on(t.updatedAt),index('idx_players_zone_pvp').on(t.zone,t.pvpMode)]);
