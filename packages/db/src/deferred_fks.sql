-- ─────────────────────────────────────────────────────────────────────────────
-- BrandingOS — Deferred Foreign Key Constraints
-- Applied after the initial migration.  These FKs create circular dependencies
-- that Drizzle ORM cannot express with .references() without causing import
-- cycles, so they live here as plain SQL to be run once after migrate.
-- ─────────────────────────────────────────────────────────────────────────────

-- order_items.course_id → courses.id
-- (orders.ts imports products.ts; courses.ts would create a cycle back to orders)
ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_course_id
  FOREIGN KEY (course_id)
  REFERENCES courses(id)
  ON DELETE SET NULL;

-- enrollments.order_id → orders.id
-- (enrollments.ts imports courses.ts; orders.ts imports products.ts → no cycle possible
--  without going through courses → enrollments → orders)
ALTER TABLE enrollments
  ADD CONSTRAINT fk_enrollments_order_id
  FOREIGN KEY (order_id)
  REFERENCES orders(id)
  ON DELETE SET NULL;

-- course_discussions.parent_id → course_discussions.id  (self-reference)
ALTER TABLE course_discussions
  ADD CONSTRAINT fk_course_discussions_parent_id
  FOREIGN KEY (parent_id)
  REFERENCES course_discussions(id)
  ON DELETE SET NULL;

-- team_permissions.portfolio_id → portfolios.id
-- (teams.ts does not import portfolios.ts to avoid a potential cycle)
ALTER TABLE team_permissions
  ADD CONSTRAINT fk_team_permissions_portfolio_id
  FOREIGN KEY (portfolio_id)
  REFERENCES portfolios(id)
  ON DELETE CASCADE;

-- ai_topup_packs.order_id → orders.id
-- (ai.ts does not import orders.ts)
ALTER TABLE ai_topup_packs
  ADD CONSTRAINT fk_ai_topup_packs_order_id
  FOREIGN KEY (order_id)
  REFERENCES orders(id)
  ON DELETE SET NULL;
