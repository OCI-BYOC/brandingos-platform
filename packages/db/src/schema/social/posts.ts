import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users.js";

export const socialPlatformEnum = pgEnum("social_platform", [
  "linkedin","twitter","instagram","youtube","threads","bluesky","devto","hashnode",
]);
export const postStatusEnum = pgEnum("post_status", ["draft","scheduled","published","failed","cancelled"]);

export const socialAccounts = pgTable(
  "social_accounts",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    userId:          text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    platform:        socialPlatformEnum("platform").notNull(),
    externalId:      text("external_id").notNull(),
    username:        text("username"),
    displayName:     text("display_name"),
    profileImageUrl: text("profile_image_url"),
    accessToken:     text("access_token"),    // encrypted
    refreshToken:    text("refresh_token"),   // encrypted
    tokenExpiresAt:  timestamp("token_expires_at", { withTimezone: true }),
    isActive:        boolean("is_active").notNull().default(true),
    deletedAt:       timestamp("deleted_at", { withTimezone: true }),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userPlatformUniq: uniqueIndex("social_accounts_user_platform_uniq").on(t.userId, t.platform),
    userIdx:          index("social_accounts_user_idx").on(t.userId),
  })
);

// ─── Platform-specific post tables ───────────────────────────────────────────
// Each has common columns + platform-specific extras.
// A helper reduces repetition for the shared columns.

const commonPostCols = (socialAccountsRef: typeof socialAccounts) => ({
  id:                   uuid("id").primaryKey().defaultRandom(),
  userId:               text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  socialAccountId:      uuid("social_account_id").notNull().references(() => socialAccountsRef.id, { onDelete: "cascade" }),
  content:              text("content").notNull(),
  status:               postStatusEnum("status").notNull().default("draft"),
  scheduledAt:          timestamp("scheduled_at", { withTimezone: true }),
  publishedAt:          timestamp("published_at", { withTimezone: true }),
  externalPostId:       text("external_post_id"),
  externalPostUrl:      text("external_post_url"),
  mediaUrls:            text("media_urls").array(),
  workflowRunId:        uuid("workflow_run_id"),
  errorMessage:         text("error_message"),
  likesCount:           integer("likes_count").notNull().default(0),
  commentsCount:        integer("comments_count").notNull().default(0),
  sharesCount:          integer("shares_count").notNull().default(0),
  impressionsCount:     integer("impressions_count").notNull().default(0),
  analyticsLastFetched: timestamp("analytics_last_fetched", { withTimezone: true }),
  deletedAt:            timestamp("deleted_at", { withTimezone: true }),
  createdAt:            timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:            timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const linkedinPosts = pgTable("linkedin_posts", {
  ...commonPostCols(socialAccounts),
  articleUrl:         text("article_url"),
  articleTitle:       text("article_title"),
  articleDescription: text("article_description"),
  postType:           text("post_type"),   // text | image | article | video | document
}, (t) => ({ userIdx: index("linkedin_posts_user_idx").on(t.userId), statusIdx: index("linkedin_posts_status_idx").on(t.status, t.scheduledAt) }));

export const twitterPosts = pgTable("twitter_posts", {
  ...commonPostCols(socialAccounts),
  replyToTweetId: text("reply_to_tweet_id"),
  isThread:       boolean("is_thread").notNull().default(false),
  threadParts:    jsonb("thread_parts"),    // array of tweet texts for threads
  quoteTweetId:   text("quote_tweet_id"),
}, (t) => ({ userIdx: index("twitter_posts_user_idx").on(t.userId), statusIdx: index("twitter_posts_status_idx").on(t.status, t.scheduledAt) }));

export const instagramPosts = pgTable("instagram_posts", {
  ...commonPostCols(socialAccounts),
  postType:       text("post_type"),   // feed | reel | story | carousel
  carouselItems:  jsonb("carousel_items"),
  reelAudioName:  text("reel_audio_name"),
  locationName:   text("location_name"),
}, (t) => ({ userIdx: index("instagram_posts_user_idx").on(t.userId) }));

export const youtubePosts = pgTable("youtube_posts", {
  ...commonPostCols(socialAccounts),
  videoId:           text("video_id"),
  communityPostType: text("community_post_type"),   // text | image | poll
  pollOptions:       jsonb("poll_options"),
}, (t) => ({ userIdx: index("youtube_posts_user_idx").on(t.userId) }));

export const threadsPosts = pgTable("threads_posts", {
  ...commonPostCols(socialAccounts),
  replyToPostId: text("reply_to_post_id"),
}, (t) => ({ userIdx: index("threads_posts_user_idx").on(t.userId) }));

export const blueskyPosts = pgTable("bluesky_posts", {
  ...commonPostCols(socialAccounts),
  replyToPostUri: text("reply_to_post_uri"),
  replyToPostCid: text("reply_to_post_cid"),
}, (t) => ({ userIdx: index("bluesky_posts_user_idx").on(t.userId) }));

export const devtoPosts = pgTable("devto_posts", {
  ...commonPostCols(socialAccounts),
  title:        text("title").notNull(),
  tags:         text("tags").array(),
  canonicalUrl: text("canonical_url"),
  mainImage:    text("main_image"),
  isPublished:  boolean("is_published").notNull().default(false),
  externalSlug: text("external_slug"),
}, (t) => ({ userIdx: index("devto_posts_user_idx").on(t.userId) }));

export const hashnodePosts = pgTable("hashnode_posts", {
  ...commonPostCols(socialAccounts),
  title:          text("title").notNull(),
  tags:           text("tags").array(),
  canonicalUrl:   text("canonical_url"),
  mainImage:      text("main_image"),
  publicationId:  text("publication_id"),   // Hashnode publication ID
  isPublished:    boolean("is_published").notNull().default(false),
}, (t) => ({ userIdx: index("hashnode_posts_user_idx").on(t.userId) }));

// ─── Voice model training samples ────────────────────────────────────────────
export const voiceModelSamples = pgTable(
  "voice_model_samples",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    sourceType:    text("source_type").notNull(),   // portfolio | newsletter | social_post | manual
    sourceId:      text("source_id"),
    content:       text("content").notNull(),
    contentType:   text("content_type"),            // bio | newsletter_body | twitter_post | linkedin_post
    wordCount:     integer("word_count"),
    modelVersion:  integer("model_version").notNull().default(1),
    createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("voice_model_samples_user_idx").on(t.userId) })
);

// ─── Content automation workflows ────────────────────────────────────────────
export const contentWorkflows = pgTable(
  "content_workflows",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    userId:      text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name:        text("name").notNull(),
    trigger:     text("trigger").notNull(),   // manual | schedule | on_publish | on_new_follower | on_new_sale
    triggerConfig: jsonb("trigger_config").default({}),
    steps:       jsonb("steps").notNull().default([]),
    isActive:    boolean("is_active").notNull().default(true),
    lastRunAt:   timestamp("last_run_at", { withTimezone: true }),
    runCount:    integer("run_count").notNull().default(0),
    deletedAt:   timestamp("deleted_at", { withTimezone: true }),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("content_workflows_user_idx").on(t.userId) })
);

export const contentWorkflowRuns = pgTable("content_workflow_runs", {
  id:           uuid("id").primaryKey().defaultRandom(),
  workflowId:   uuid("workflow_id").notNull().references(() => contentWorkflows.id, { onDelete: "cascade" }),
  status:       text("status").notNull().default("pending"),  // pending|running|completed|failed
  input:        jsonb("input").default({}),
  output:       jsonb("output").default({}),
  errorMessage: text("error_message"),
  startedAt:    timestamp("started_at", { withTimezone: true }),
  completedAt:  timestamp("completed_at", { withTimezone: true }),
  createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SocialAccount     = typeof socialAccounts.$inferSelect;
export type LinkedinPost      = typeof linkedinPosts.$inferSelect;
export type TwitterPost       = typeof twitterPosts.$inferSelect;
export type ContentWorkflow   = typeof contentWorkflows.$inferSelect;
