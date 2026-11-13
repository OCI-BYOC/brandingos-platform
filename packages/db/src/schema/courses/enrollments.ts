import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users";
import { courses, cohorts, lessons } from "./courses";

export const quizQuestionTypeEnum = pgEnum("quiz_question_type", ["multiple_choice","true_false","short_answer"]);

export const enrollments = pgTable(
  "enrollments",
  {
    id:                   uuid("id").primaryKey().defaultRandom(),
    courseId:             uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    cohortId:             uuid("cohort_id").references(() => cohorts.id, { onDelete: "set null" }),
    studentId:            text("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    orderId:              uuid("order_id"),   // FK → orders.id — deferred to avoid circular
    status:               text("status").notNull().default("active"),
    completionPercentage: integer("completion_percentage").notNull().default(0),
    completedAt:          timestamp("completed_at", { withTimezone: true }),
    lastAccessedAt:       timestamp("last_accessed_at", { withTimezone: true }),
    expiresAt:            timestamp("expires_at", { withTimezone: true }),
    createdAt:            timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:            timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    courseStudentUniq: uniqueIndex("enrollments_course_student_uniq").on(t.courseId, t.studentId),
    studentIdx:        index("enrollments_student_idx").on(t.studentId),
    courseIdx:         index("enrollments_course_idx").on(t.courseId),
  })
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    enrollmentId:   uuid("enrollment_id").notNull().references(() => enrollments.id, { onDelete: "cascade" }),
    lessonId:       uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    studentId:      text("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    isCompleted:    boolean("is_completed").notNull().default(false),
    watchedSeconds: integer("watched_seconds").notNull().default(0),
    completedAt:    timestamp("completed_at", { withTimezone: true }),
    createdAt:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    enrollLessonUniq: uniqueIndex("lesson_progress_enroll_lesson_uniq").on(t.enrollmentId, t.lessonId),
    studentIdx:       index("lesson_progress_student_idx").on(t.studentId),
  })
);

export const certificates = pgTable(
  "certificates",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    courseId:         uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    studentId:        text("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    enrollmentId:     uuid("enrollment_id").notNull().references(() => enrollments.id, { onDelete: "cascade" }),
    verificationCode: text("verification_code").unique().notNull(),
    r2Key:            text("r2_key"),   // PDF stored in R2
    issuedAt:         timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    courseStudentUniq: uniqueIndex("certificates_course_student_uniq").on(t.courseId, t.studentId),
  })
);

export const quizzes = pgTable("quizzes", {
  id:              uuid("id").primaryKey().defaultRandom(),
  lessonId:        uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  title:           text("title").notNull(),
  passingScore:    integer("passing_score").notNull().default(70),
  allowedAttempts: integer("allowed_attempts"),  // null = unlimited
  createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id:          uuid("id").primaryKey().defaultRandom(),
  quizId:      uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  type:        quizQuestionTypeEnum("type").notNull().default("multiple_choice"),
  question:    text("question").notNull(),
  explanation: text("explanation"),
  points:      integer("points").notNull().default(1),
  position:    integer("position").notNull().default(0),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quizQuestionOptions = pgTable("quiz_question_options", {
  id:         uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id").notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
  text:       text("text").notNull(),
  isCorrect:  boolean("is_correct").notNull().default(false),
  position:   integer("position").notNull().default(0),
});

export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id:           uuid("id").primaryKey().defaultRandom(),
    quizId:       uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
    studentId:    text("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    enrollmentId: uuid("enrollment_id").notNull().references(() => enrollments.id, { onDelete: "cascade" }),
    score:        integer("score").notNull(),
    isPassed:     boolean("is_passed").notNull(),
    answers:      jsonb("answers").notNull().default({}),
    completedAt:  timestamp("completed_at", { withTimezone: true }),
    createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    quizStudentIdx: index("quiz_attempts_quiz_student_idx").on(t.quizId, t.studentId),
  })
);

export const courseDiscussions = pgTable(
  "course_discussions",
  {
    id:         uuid("id").primaryKey().defaultRandom(),
    courseId:   uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    lessonId:   uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
    authorId:   text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    parentId:   uuid("parent_id"),   // self-ref added via ALTER TABLE
    content:    text("content").notNull(),
    isPinned:   boolean("is_pinned").notNull().default(false),
    isResolved: boolean("is_resolved").notNull().default(false),
    deletedAt:  timestamp("deleted_at", { withTimezone: true }),
    createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    courseIdx: index("course_discussions_course_idx").on(t.courseId),
    lessonIdx: index("course_discussions_lesson_idx").on(t.lessonId),
  })
);

export type Enrollment      = typeof enrollments.$inferSelect;
export type LessonProgress  = typeof lessonProgress.$inferSelect;
export type Certificate     = typeof certificates.$inferSelect;
export type QuizAttempt     = typeof quizAttempts.$inferSelect;
