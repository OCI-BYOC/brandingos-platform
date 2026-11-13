// ─── BrandingOS Database Schema — Barrel Export ───────────────────────────────
// 88 tables across 14 domains.  Import from "@brandingos/db/schema".

// ── Core ──────────────────────────────────────────────────────────────────────
export * from "./users";
export * from "./portfolios";
export * from "./integrations";
export * from "./analytics_events";

// ── Commerce ──────────────────────────────────────────────────────────────────
export * from "./commerce/products";
export * from "./commerce/orders";
export * from "./commerce/payments";

// ── Courses / LMS ─────────────────────────────────────────────────────────────
export * from "./courses/courses";
export * from "./courses/enrollments";

// ── Social Agent ──────────────────────────────────────────────────────────────
export * from "./social/posts";

// ── Job Intelligence ──────────────────────────────────────────────────────────
export * from "./jobs/jobs";

// ── Newsletter ────────────────────────────────────────────────────────────────
export * from "./newsletter/newsletter";

// ── Booking ───────────────────────────────────────────────────────────────────
export * from "./booking/booking";

// ── AI Layer ──────────────────────────────────────────────────────────────────
export * from "./ai/ai";

// ── Teams & Agency ────────────────────────────────────────────────────────────
export * from "./teams/teams";

// ── Platform ──────────────────────────────────────────────────────────────────
export * from "./platform/subscriptions";
export * from "./platform/notifications";
export * from "./platform/mcp";
export * from "./platform/audit";
