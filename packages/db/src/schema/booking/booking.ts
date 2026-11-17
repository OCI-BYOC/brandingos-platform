import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, date, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users.js";

export const availabilityExceptionTypeEnum = pgEnum("availability_exception_type", ["unavailable","custom_hours"]);
export const bookingStatusEnum             = pgEnum("booking_status",              ["pending","confirmed","cancelled","completed","no_show"]);
export const bookingLocationEnum           = pgEnum("booking_location",            ["zoom","google_meet","phone","in_person","custom"]);
export const bookingPaymentStatusEnum      = pgEnum("booking_payment_status",      ["pending","paid","refunded","failed"]);

export const meetingTypes = pgTable(
  "meeting_types",
  {
    id:                     uuid("id").primaryKey().defaultRandom(),
    userId:                 text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name:                   text("name").notNull(),
    description:            text("description"),
    slug:                   text("slug").notNull(),
    durationMinutes:        integer("duration_minutes").notNull().default(30),
    price:                  integer("price").notNull().default(0),  // 0 = free
    currency:               text("currency").notNull().default("INR"),
    isActive:               boolean("is_active").notNull().default(true),
    location:               bookingLocationEnum("location").notNull().default("google_meet"),
    locationDetails:        text("location_details"),
    bufferMinutesAfter:     integer("buffer_minutes_after").notNull().default(0),
    maxAdvanceBookingDays:  integer("max_advance_booking_days").notNull().default(60),
    requiresApproval:       boolean("requires_approval").notNull().default(false),
    confirmationMessage:    text("confirmation_message"),
    color:                  text("color"),    // for calendar display
    deletedAt:              timestamp("deleted_at", { withTimezone: true }),
    createdAt:              timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:              timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:    index("meeting_types_user_idx").on(t.userId),
    slugUniq:   uniqueIndex("meeting_types_user_slug_uniq").on(t.userId, t.slug),
  })
);

// Fully flexible availability — recurring rules
export const availabilityRules = pgTable(
  "availability_rules",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    userId:      text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    meetingTypeId: uuid("meeting_type_id").references(() => meetingTypes.id, { onDelete: "cascade" }), // null = all meeting types
    dayOfWeek:   integer("day_of_week").array().notNull(),   // [0=Sun … 6=Sat]
    startTime:   text("start_time").notNull(),   // "09:00"
    endTime:     text("end_time").notNull(),     // "17:00"
    timezone:    text("timezone").notNull().default("Asia/Kolkata"),
    isActive:    boolean("is_active").notNull().default(true),
    validFrom:   date("valid_from"),
    validUntil:  date("valid_until"),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("availability_rules_user_idx").on(t.userId) })
);

// Exceptions override rules — days off, extra slots, public holiday overrides
export const availabilityExceptions = pgTable(
  "availability_exceptions",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    date:      date("date").notNull(),
    type:      availabilityExceptionTypeEnum("type").notNull(),
    startTime: text("start_time"),   // null if fully unavailable
    endTime:   text("end_time"),
    reason:    text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userDateIdx: index("availability_exceptions_user_date_idx").on(t.userId, t.date),
  })
);

export const bookingAppointments = pgTable(
  "booking_appointments",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    userId:             text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    meetingTypeId:      uuid("meeting_type_id").references(() => meetingTypes.id, { onDelete: "set null" }),
    guestName:          text("guest_name").notNull(),
    guestEmail:         text("guest_email").notNull(),
    guestPhone:         text("guest_phone"),
    guestNotes:         text("guest_notes"),
    startTime:          timestamp("start_time", { withTimezone: true }).notNull(),
    endTime:            timestamp("end_time", { withTimezone: true }).notNull(),
    timezone:           text("timezone").notNull(),
    status:             bookingStatusEnum("status").notNull().default("pending"),
    zoomMeetingId:      text("zoom_meeting_id"),
    googleMeetLink:     text("google_meet_link"),
    cancelledAt:        timestamp("cancelled_at", { withTimezone: true }),
    cancellationReason: text("cancellation_reason"),
    reminderSentAt:     timestamp("reminder_sent_at", { withTimezone: true }),
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:          timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:    index("booking_appointments_user_idx").on(t.userId),
    statusIdx:  index("booking_appointments_status_idx").on(t.userId, t.status),
    timeIdx:    index("booking_appointments_time_idx").on(t.userId, t.startTime),
  })
);

export const bookingPayments = pgTable("booking_payments", {
  id:              uuid("id").primaryKey().defaultRandom(),
  appointmentId:   uuid("appointment_id").notNull().references(() => bookingAppointments.id, { onDelete: "cascade" }),
  amount:          integer("amount").notNull(),
  currency:        text("currency").notNull(),
  provider:        text("provider").notNull(),
  providerPaymentId: text("provider_payment_id"),
  status:          bookingPaymentStatusEnum("status").notNull().default("pending"),
  paidAt:          timestamp("paid_at", { withTimezone: true }),
  refundedAt:      timestamp("refunded_at", { withTimezone: true }),
  createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MeetingType          = typeof meetingTypes.$inferSelect;
export type BookingAppointment   = typeof bookingAppointments.$inferSelect;
