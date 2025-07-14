import { InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, timestamp, pgEnum, serial } from 'drizzle-orm/pg-core'


export const statusEnum = pgEnum('status', [
  'new',
  'in_progress',
  'done',
])


export const primaryObjectiveEnum = pgEnum('primary_objectives', [
  'bunker_assault',
  'breakthrough',
  'close_the_pocket',
  'intercept_the_signals',
  'recover_the_research',
  'shifting_priorities', 
])

export const secondaryObjectiveEnum = pgEnum('secondary_objectives', [
  'bring_them_to_heel',
  'marked_targets',
  'recon_mission',
  'surface_scan',
  'sweep_and_clear',
]
)

export const advantageEnum = pgEnum('advantage',[
  'advanced_intel',
  'cunning_deployment',
  'fortified_position',
  'garrison',
  'ordnance',
  'strafing_run',
])

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
    }
)

export const games = pgTable('games',{
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    primaryObjective: primaryObjectiveEnum('primaryObjective').default('breakthrough').notNull(),
    secondaryObjective: secondaryObjectiveEnum('secondaryObjective').default('bring_them_to_heel').notNull(),
    advantage: advantageEnum('advantage').default('advanced_intel').notNull(),
    status: statusEnum('status').default('new').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    userId: text('user_id').notNull(),
})


export const gameRelations = relations(games, ({ one }) => ({
  user: one(users, {
    fields: [games.userId],
    references: [users.id],
  }),
}))


export const usersRelations = relations(users, ({ many }) => ({
  issues: many(games),
}))

// Types
export type Game = InferSelectModel<typeof games>
export type User = InferSelectModel<typeof users>

// Status and priority labels for display
export const GAME_STATUS = {
  new: { label: 'New', value: 'new' },
  in_progress: { label: 'In Progress', value: 'in_progress' },
  done: { label: 'Done', value: 'done' },
}

export const PRIMARY_OBJECTIVE = {
  bunker_assault: { label: 'Bunker Assault', value: 'bunker_assault' },
  breakthrough: { label: 'Breakthrough', value: 'breakthrough' },
  close_the_pocket: { label: 'Close the Pocket', value: 'close_the_pocket' },
  intercept_the_signals: { label: 'Intercept the Signals', value: 'intercept_the_signals' },
  recover_the_research: { label: 'Recover the Research', value: 'recover_the_research' },
  shifting_priorities: { label: 'Shifting Priorities', value: 'shifting_priorities' },
}

export const SECONDARY_OBJECTIVE = {
  bring_them_to_heel: { label: 'Bring Them to Heel', value: 'bring_them_to_heel' },
  surface_scan: { label: 'Surface Scan', value: 'surface_scan' },
  marked_targets: { label: 'Marked Targets', value: 'marked_targets' },
  recon_mission: { label: 'Recon Mission', value: 'recon_mission' },
  sweep_and_clear: { label: 'Sweep and Clear', value: 'sweep_and_clear' },
}

export const ADVANTAGE = {
  advanced_intel: { label: 'Advanced Intel', value: 'advanced_intel' },
  cunning_deployment: { label: 'Cunning Deployment', value: 'cunning_deployment' },
  fortified_position: { label: 'Fortified Position', value: 'fortified_position' },
  garrison: { label: 'Garrison', value: 'garrison' },
  ordnance: { label: 'Ordnance', value: 'ordnance' },
  strafing_run: { label: 'Strafing Run', value: 'strafing_run' },
}
