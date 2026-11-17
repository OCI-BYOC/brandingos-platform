import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users.js";

// Resume stored as LaTeX source + compiled PDF (PDF generated on demand via latexmk/tectonic)
export const resumeCompileStatusEnum = pgEnum("resume_compile_status", ["pending","compiling","compiled","failed"]);

export const resumeVersions = pgTable(
  "resume_versions",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    userId:          text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name:            text("name").notNull(),   // "v1 — Startup CLM", "v2 — Enterprise DocuSign"
    targetRole:      text("target_role"),
    targetCompany:   text("target_company"),  // null = general purpose
    latexSource:     text("latex_source"),    // Full .tex source stored in DB for fast editing
    latexR2Key:      text("latex_r2_key"),    // .tex file also archived in R2
    compiledPdfR2Key: text("compiled_pdf_r2_key"),
    compiledPdfUrl:  text("compiled_pdf_url"),
    compileStatus:   resumeCompileStatusEnum("compile_status").notNull().default("pending"),
    compileError:    text("compile_error"),
    compiledAt:      timestamp("compiled_at", { withTimezone: true }),
    isDefault:       boolean("is_default").notNull().default(false),
    deletedAt:       timestamp("deleted_at", { withTimezone: true }),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:       timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("resume_versions_user_idx").on(t.userId) })
);

export const jobSearchConfigs = pgTable(
  "job_search_configs",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    userId:         text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name:           text("name").notNull(),
    keywords:       text("keywords").array(),
    locations:      text("locations").array(),
    jobTypes:       text("job_types").array(),   // full_time | remote | hybrid | contract
    minSalary:      integer("min_salary"),
    maxSalary:      integer("max_salary"),
    salaryCurrency: text("salary_currency").default("INR"),
    excludeKeywords: text("exclude_keywords").array(),
    companySizes:   text("company_sizes").array(),   // startup | mid | enterprise
    isActive:       boolean("is_active").notNull().default(true),
    lastRunAt:      timestamp("last_run_at", { withTimezone: true }),
    createdAt:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("job_search_configs_user_idx").on(t.userId) })
);

export const jobListings = pgTable(
  "job_listings",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    userId:          text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    adzunaJobId:     text("adzuna_job_id"),
    sourceUrl:       text("source_url"),
    title:           text("title").notNull(),
    company:         text("company").notNull(),
    location:        text("location"),
    salary:          jsonb("salary"),    // {min, max, currency, period}
    description:     text("description"),
    requirements:    text("requirements").array(),
    jobType:         text("job_type"),
    isRemote:        boolean("is_remote").notNull().default(false),
    postedAt:        timestamp("posted_at", { withTimezone: true }),
    expiresAt:       timestamp("expires_at", { withTimezone: true }),
    aiMatchScore:    integer("ai_match_score"),    // 0–100
    aiMatchNotes:    text("ai_match_notes"),
    searchConfigId:  uuid("search_config_id").references(() => jobSearchConfigs.id, { onDelete: "set null" }),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userAdzunaUniq: uniqueIndex("job_listings_user_adzuna_uniq").on(t.userId, t.adzunaJobId),
    userIdx:        index("job_listings_user_idx").on(t.userId),
    scoreIdx:       index("job_listings_score_idx").on(t.userId, t.aiMatchScore),
  })
);

export const jobApplications = pgTable(
  "job_applications",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    userId:           text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    jobListingId:     uuid("job_listing_id").references(() => jobListings.id, { onDelete: "set null" }),
    resumeVersionId:  uuid("resume_version_id").references(() => resumeVersions.id, { onDelete: "set null" }),
    stage:            text("stage").notNull().default("bookmarked"),
    // bookmarked → applied → screening → interview → offer → accepted | rejected | withdrew
    appliedAt:        timestamp("applied_at", { withTimezone: true }),
    notes:            text("notes"),
    appliedVia:       text("applied_via"),
    contactEmail:     text("contact_email"),
    offeredSalary:    integer("offered_salary"),
    createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:        timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:   index("job_applications_user_idx").on(t.userId),
    stageIdx:  index("job_applications_stage_idx").on(t.userId, t.stage),
  })
);

export const coverLetters = pgTable("cover_letters", {
  id:            uuid("id").primaryKey().defaultRandom(),
  userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobListingId:  uuid("job_listing_id").references(() => jobListings.id, { onDelete: "set null" }),
  applicationId: uuid("application_id").references(() => jobApplications.id, { onDelete: "set null" }),
  content:       text("content").notNull(),
  tone:          text("tone").default("formal"),   // formal | conversational | enthusiastic
  aiGenerated:   boolean("ai_generated").notNull().default(true),
  createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const interviewPreps = pgTable("interview_preps", {
  id:            uuid("id").primaryKey().defaultRandom(),
  userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobListingId:  uuid("job_listing_id").references(() => jobListings.id, { onDelete: "set null" }),
  applicationId: uuid("application_id").references(() => jobApplications.id, { onDelete: "set null" }),
  questions:     jsonb("questions").notNull().default([]),  // [{question, answer, type, difficulty}]
  companyBrief:  text("company_brief"),
  createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const coldEmails = pgTable("cold_emails", {
  id:                  uuid("id").primaryKey().defaultRandom(),
  userId:              text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobListingId:        uuid("job_listing_id").references(() => jobListings.id, { onDelete: "set null" }),
  recipientName:       text("recipient_name"),
  recipientEmail:      text("recipient_email"),
  recipientLinkedinUrl: text("recipient_linkedin_url"),
  subject:             text("subject").notNull(),
  body:                text("body").notNull(),
  status:              text("status").notNull().default("draft"),  // draft | approved | sent
  sentAt:              timestamp("sent_at", { withTimezone: true }),
  createdAt:           timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ResumeVersion   = typeof resumeVersions.$inferSelect;
export type JobListing      = typeof jobListings.$inferSelect;
export type JobApplication  = typeof jobApplications.$inferSelect;
