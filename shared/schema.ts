import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  logo: text("logo"),
  budget: decimal("budget", { precision: 12, scale: 2 }).default("1000000"),
  reputation: integer("reputation").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  teamId: integer("team_id").references(() => teams.id),
  role: text("role").notNull(), // "duelist", "initiator", "controller", "sentinel", "flex"
  nationality: text("nationality").notNull(),
  age: integer("age").notNull(),
  
  // Stats (0-100 scale)
  aim: integer("aim").notNull(),
  gameIq: integer("game_iq").notNull(),
  clutch: integer("clutch").notNull(),
  teamwork: integer("teamwork").notNull(),
  positioning: integer("positioning").notNull(),
  
  // Contract details
  salary: decimal("salary", { precision: 10, scale: 2 }),
  contractEnd: timestamp("contract_end"),
  
  // Current state
  morale: integer("morale").default(75),
  energy: integer("energy").default(100),
  isStarter: boolean("is_starter").default(false),
  isSubstitute: boolean("is_substitute").default(false),
  
  // Market status
  isAvailable: boolean("is_available").default(true),
  marketValue: decimal("market_value", { precision: 10, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  role: text("role").notNull(), // "duelist", "initiator", "controller", "sentinel"
  description: text("description").notNull(),
  abilities: jsonb("abilities").notNull(), // JSON array of ability objects
  difficulty: integer("difficulty").notNull(), // 1-5 scale
  isOriginal: boolean("is_original").default(false), // true for 2 original agents
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id),
  homeTeamId: integer("home_team_id").references(() => teams.id).notNull(),
  awayTeamId: integer("away_team_id").references(() => teams.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  
  // Match results
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  status: text("status").default("scheduled"), // "scheduled", "live", "completed"
  
  // Match details
  map: text("map"),
  homeTeamDraft: jsonb("home_team_draft"), // Array of agent picks
  awayTeamDraft: jsonb("away_team_draft"),
  
  // Statistics
  matchData: jsonb("match_data"), // Detailed round-by-round data
  
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "national", "continental", "world"
  status: text("status").default("upcoming"), // "upcoming", "active", "completed"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  prizePool: decimal("prize_pool", { precision: 12, scale: 2 }),
  maxTeams: integer("max_teams").default(16),
  currentRound: text("current_round").default("group_stage"),
  bracketData: jsonb("bracket_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scouting = pgTable("scouting", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  scoutedAt: timestamp("scouted_at").defaultNow(),
  report: text("report"),
  rating: integer("rating"), // 1-10 scale
  recommendation: text("recommendation"), // "sign", "pass", "monitor"
});

export const gameState = pgTable("game_state", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  currentDate: timestamp("current_date").defaultNow(),
  currentSeason: integer("current_season").default(1),
  phase: text("phase").default("pre_season"), // "pre_season", "regular", "playoffs", "off_season"
  tutorialCompleted: boolean("tutorial_completed").default(false),
  settings: jsonb("settings").default("{}"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  name: text("name").notNull(),
  role: text("role").notNull(), // "analyst", "coach", "mental_trainer", "statistician"
  specialty: text("specialty"),
  salary: decimal("salary", { precision: 8, scale: 2 }),
  contractEnd: timestamp("contract_end"),
  
  // Staff abilities
  experience: integer("experience").notNull(), // 0-100
  reputation: integer("reputation").notNull(), // 0-100
  
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  region: true,
  logo: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Player = typeof players.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type Scouting = typeof scouting.$inferSelect;
export type GameState = typeof gameState.$inferSelect;
export type Staff = typeof staff.$inferSelect;
