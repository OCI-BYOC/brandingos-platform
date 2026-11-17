// ─── BrandingOS Database Schema — Barrel Export ───────────────────────────────
// 88 tables across 14 domains.  Import from "@brandingos/db/schema".

// ── Core ──────────────────────────────────────────────────────────────────────
export * from "./users.js";
export * from "./portfolios.js";
export * from "./integrations.js";
export * from "./analytics_events.js";

// ── Commerce ──────────────────────────────────────────────────────────────────
export * from "./commerce/products.js";
export * from "./commerce/orders.js";
export * from "./commerce/payments.js";

// ── Courses / LMS ─────────────────────────────────────────────────────────────
export * from "./courses/courses.js";
export * from "./courses/enrollments.js";

// ── Social Agent ──────────────────────────────────────────────────────────────
export * from "./social/posts.js";

// ── Job Intelligence ──────────────────────────────────────────────────────────
export * from "./jobs/jobs.js";

// ── Newsletter ────────────────────────────────────────────────────────────────
export * from "./newsletter/newsletter.js";

// ── Booking ───────────────────────────────────────────────────────────────────
export * from "./booking/booking.js";

// ── AI Layer ──────────────────────────────────────────────────────────────────
export * from "./ai/ai.js";

// ── Teams & Agency ────────────────────────────────────────────────────────────
export * from "./teams/teams.js";

// ── Platform ──────────────────────────────────────────────────────────────────
export * from "./platform/subscriptions.js";
export * from "./platform/notifications.js";
export * from "./platform/mcp.js";
export * from "./platform/audit.js";
