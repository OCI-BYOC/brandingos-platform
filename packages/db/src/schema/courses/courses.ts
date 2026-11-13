import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, numeric, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users";

export const courseLevelEnum    = pgEnum("course_level",    ["beginner","intermediate","advanced"]);
export const courseStatusEnum   = pgEnum("course_status",   ["draft","published","archived"]);
export const deliveryTypeEnum   = pgEnum("course_delivery", ["self_paced","cohort","drip"]);
export const pricingModelEnum   = pgEnum("course_pricing",  ["free","one_time","subscription"]);
export const lessonTypeEnum     = pgEnum("lesson_type",     ["video","text","quiz","live","assignment"]);
export const videoStatusEnum    = pgEnum("video_status",    ["pending","processing","ready","failed"]);
export const cohortStatusEnum   = pgEnum("cohort_status",   ["upcoming","active","completed"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["active","completed","refunded","expired"]);

export const courses = pgTable(
  "courses",
  {
    id:                  uuid("id").primaryKey().defaultRandom(),
    userId:              text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title:               text("title").notNull(),
    slug:                text("slug").notNull(),
    tagline:             text("tagline"),
    description:         text("description"),
    coverImageUrl:       text("cover_image_url"),
    previewVideoUrl:     text("preview_video_url"),
    level:               courseLevelEnum("level").notNull().default("beginner"),
    language:            text("language").notNull().default("en"),
    status:              courseStatusEnum("status").notNull().default("draft"),
    deliveryType:        deliveryTypeEnum("delivery_type").notNull().default("self_paced"),
    pricingModel:        pricingModelEnum("pricing_model").notNull().default("one_time"),
    price:               integer("price").notNull().default(0),
    currency:            text("currency").notNull().default("INR"),
    totalLessons:        integer("total_lessons").notNull().default(0),
    totalDurationSeconds: integer("total_duration_seconds").notNull().default(0),
    enrollmentCount:     integer("enrollment_count").notNull().default(0),
    averageRating:       numeric("average_rating", { precision: 3, scale: 2 }),
    requiresApproval:    boolean("requires_approval").notNull().default(false),
    certificateEnabled:  boolean("certificate_enabled").notNull().default(true),
    discussionEnabled:   boolean("discussion_enabled").notNull().default(true),
    deletedAt:           timestamp("deleted_at", { withTimezone: true }),
    createdAt:           timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:           timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:    index("courses_user_idx").on(t.userId),
    statusIdx:  index("courses_status_idx").on(t.status),
    slugUniq:   uniqueIndex("courses_user_slug_uniq").on(t.userId, t.slug),
  })
);

export const courseSections = pgTable(
  "course_sections",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    courseId:    uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title:       text("title").notNull(),
    description: text("description"),
    position:    integer("position").notNull().default(0),
    isPreview:   boolean("is_preview").notNull().default(false),
    deletedAt:   timestamp("deleted_at", { withTimezone: true }),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ courseIdx: index("course_sections_course_idx").on(t.courseId) })
);

export const lessons = pgTable(
  "lessons",
  {
    id:                        uuid("id").primaryKey().defaultRandom(),
    sectionId:                 uuid("section_id").notNull().references(() => courseSections.id, { onDelete: "cascade" }),
    courseId:                  uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title:                     text("title").notNull(),
    description:               text("description"),
    type:                      lessonTypeEnum("type").notNull().default("video"),
    position:                  integer("position").notNull().default(0),
    durationSeconds:           integer("duration_seconds"),
    isPreview:                 boolean("is_preview").notNull().default(false),
    isPublished:               boolean("is_published").notNull().default(false),
    dripDaysAfterEnrollment:   integer("drip_days_after_enrollment"), // null = no drip
    zoomMeetingUrl:            text("zoom_meeting_url"),
    googleMeetUrl:             text("google_meet_url"),
    deletedAt:                 timestamp("deleted_at", { withTimezone: true }),
    createdAt:                 timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:                 timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sectionIdx: index("lessons_section_idx").on(t.sectionId),
    courseIdx:  index("lessons_course_idx").on(t.courseId),
  })
);

export const lessonVideos = pgTable(
  "lesson_videos",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    lessonId:        uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    status:          videoStatusEnum("status").notNull().default("pending"),
    originalR2Key:   text("original_r2_key"),
    hlsR2Prefix:     text("hls_r2_prefix"),   // prefix for all HLS segment files
    durationSeconds: integer("duration_seconds"),
    resolutions:     text("resolutions").array(),   // ['480p','720p','1080p']
    thumbnailUrl:    text("thumbnail_url"),
    processingError: text("processing_error"),
    processedAt:     timestamp("processed_at", { withTimezone: true }),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const lessonAttachments = pgTable(
  "lesson_attachments",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    lessonId:  uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    name:      text("name").notNull(),
    r2Key:     text("r2_key").notNull(),
    sizeBytes: integer("size_bytes"),
    mimeType:  text("mime_type"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const cohorts = pgTable(
  "cohorts",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    courseId:         uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    name:             text("name").notNull(),
    startDate:        timestamp("start_date", { withTimezone: true }),
    endDate:          timestamp("end_date", { withTimezone: true }),
    maxEnrollments:   integer("max_enrollments"),
    enrollmentCount:  integer("enrollment_count").notNull().default(0),
    status:           cohortStatusEnum("status").notNull().default("upcoming"),
    deletedAt:        timestamp("deleted_at", { withTimezone: true }),
    createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ courseIdx: index("cohorts_course_idx").on(t.courseId) })
);

export const courseCoupons = pgTable(
  "course_coupons",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    courseId:         uuid("course_id").references(() => courses.id, { onDelete: "cascade" }), // null = all courses
    userId:           text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    code:             text("code").unique().notNull(),
    type:             text("type").notNull(),   // percentage | fixed_amount
    value:            integer("value").notNull(),
    maxRedemptions:   integer("max_redemptions"),
    redemptionCount:  integer("redemption_count").notNull().default(0),
    validFrom:        timestamp("valid_from", { withTimezone: true }),
    validUntil:       timestamp("valid_until", { withTimezone: true }),
    deletedAt:        timestamp("deleted_at", { withTimezone: true }),
    createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const courseAffiliates = pgTable(
  "course_affiliates",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    courseId:        uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    affiliateId:     text("affiliate_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    referralCode:    text("referral_code").unique().notNull(),
    commissionRate:  integer("commission_rate").notNull().default(10), // percentage
    earningsTotal:   integer("earnings_total").notNull().default(0),
    clickCount:      integer("click_count").notNull().default(0),
    conversionCount: integer("conversion_count").notNull().default(0),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    courseIdx: index("course_affiliates_course_idx").on(t.courseId),
    uniq:      uniqueIndex("course_affiliates_uniq").on(t.courseId, t.affiliateId),
  })
);

export type Course         = typeof courses.$inferSelect;
export type Lesson         = typeof lessons.$inferSelect;
export type LessonVideo    = typeof lessonVideos.$inferSelect;
export type Cohort         = typeof cohorts.$inferSelect;
