import {
  pgTable, pgEnum, text, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users.js";

export const teamTypeEnum       = pgEnum("team_type",       ["personal","agency"]);
export const teamMemberRoleEnum = pgEnum("team_member_role", ["owner","admin","editor","viewer"]);
export const teamMemberStatusEnum = pgEnum("team_member_status", ["pending","active","suspended","removed"]);

export const teams = pgTable(
  "teams",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    ownerId:            text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name:               text("name").notNull(),
    type:               teamTypeEnum("type").notNull().default("personal"),
    slug:               text("slug").unique().notNull(),
    logoUrl:            text("logo_url"),
    whitelabelDomain:   text("whitelabel_domain"),
    whitelabelName:     text("whitelabel_name"),
    whitelabelLogoUrl:  text("whitelabel_logo_url"),
    deletedAt:          timestamp("deleted_at", { withTimezone: true }),
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:          timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ ownerIdx: index("teams_owner_idx").on(t.ownerId) })
);

export const teamMembers = pgTable(
  "team_members",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    teamId:           uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    userId:           text("user_id").references(() => users.id, { onDelete: "cascade" }),
    role:             teamMemberRoleEnum("role").notNull().default("viewer"),
    inviteEmail:      text("invite_email"),    // pre-acceptance
    inviteToken:      text("invite_token"),
    inviteExpiresAt:  timestamp("invite_expires_at", { withTimezone: true }),
    status:           teamMemberStatusEnum("status").notNull().default("pending"),
    joinedAt:         timestamp("joined_at", { withTimezone: true }),
    createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:        timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    teamUserUniq: uniqueIndex("team_members_team_user_uniq").on(t.teamId, t.userId),
    teamIdx:      index("team_members_team_idx").on(t.teamId),
    userIdx:      index("team_members_user_idx").on(t.userId),
  })
);

// Granular per-feature toggle permissions
// Features: edit_portfolio | manage_products | post_socials | view_analytics |
//           access_payments | manage_courses | manage_bookings | manage_newsletter | manage_jobs
export const teamPermissions = pgTable(
  "team_permissions",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    teamMemberId:  uuid("team_member_id").notNull().references(() => teamMembers.id, { onDelete: "cascade" }),
    feature:       text("feature").notNull(),
    portfolioId:   uuid("portfolio_id"),    // null = applies to all portfolios; FK added via ALTER TABLE
    isAllowed:     boolean("is_allowed").notNull().default(false),
    createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:     timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    memberFeatureUniq: uniqueIndex("team_permissions_member_feature_portfolio_uniq")
      .on(t.teamMemberId, t.feature, t.portfolioId),
    memberIdx: index("team_permissions_member_idx").on(t.teamMemberId),
  })
);

// Agency-managed client accounts
export const agencyClients = pgTable(
  "agency_clients",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    agencyTeamId:  uuid("agency_team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    clientUserId:  text("client_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status:        text("status").notNull().default("active"),  // active | inactive | archived
    notes:         text("notes"),
    addedAt:       timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:     timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    agencyClientUniq: uniqueIndex("agency_clients_agency_client_uniq").on(t.agencyTeamId, t.clientUserId),
    agencyIdx:        index("agency_clients_agency_idx").on(t.agencyTeamId),
  })
);

export type Team         = typeof teams.$inferSelect;
export type TeamMember   = typeof teamMembers.$inferSelect;
export type AgencyClient = typeof agencyClients.$inferSelect;
