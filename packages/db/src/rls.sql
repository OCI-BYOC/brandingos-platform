-- ─────────────────────────────────────────────────────────────────────────────
-- BrandingOS — Row Level Security Policies
-- Applied after Drizzle migrations.  Clerk JWT → current_setting('app.user_id').
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on every user-owned table
ALTER TABLE users                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences           ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_sections         ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations               ENABLE ROW LEVEL SECURITY;
ALTER TABLE products                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attribute_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants           ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_product_files      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items                ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_shipments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_accounts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials               ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sections            ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_videos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attachments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments                ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress            ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates               ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_coupons             ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_affiliates          ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_discussions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads_posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE bluesky_posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE devto_posts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashnode_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_model_samples        ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_workflows          ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_search_configs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters              ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_preps            ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters                ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_types              ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_exceptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_appointments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_payments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credit_ledger           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_topup_packs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workflows               ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_connections         ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_health_scores        ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_reports           ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members               ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_permissions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_clients             ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications              ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications              ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences   ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_sessions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_tool_calls             ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workflow_runs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaign_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_workflow_runs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cold_emails                ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_question_options      ENABLE ROW LEVEL SECURITY;

-- ─── Helper function ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
  SELECT current_setting('app.user_id', TRUE)
$$ LANGUAGE SQL STABLE;

-- ─── users ────────────────────────────────────────────────────────────────────
CREATE POLICY "users_own" ON users
  USING (id = current_user_id());

-- ─── user_preferences ────────────────────────────────────────────────────────
CREATE POLICY "user_preferences_own" ON user_preferences
  USING (user_id = current_user_id());

-- ─── portfolios ──────────────────────────────────────────────────────────────
-- Public can read published, non-deleted portfolios; owner has full access
CREATE POLICY "portfolios_public_read" ON portfolios
  FOR SELECT USING (is_published = true AND deleted_at IS NULL);

CREATE POLICY "portfolios_owner_all" ON portfolios
  USING (user_id = current_user_id());

-- ─── portfolio_sections ───────────────────────────────────────────────────────
CREATE POLICY "portfolio_sections_public_read" ON portfolio_sections
  FOR SELECT USING (
    is_visible = true AND deleted_at IS NULL AND
    portfolio_id IN (
      SELECT id FROM portfolios WHERE is_published = true AND deleted_at IS NULL
    )
  );

CREATE POLICY "portfolio_sections_owner_all" ON portfolio_sections
  USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = current_user_id())
  );

-- ─── integrations ─────────────────────────────────────────────────────────────
CREATE POLICY "integrations_own" ON integrations
  USING (user_id = current_user_id());

-- ─── products ─────────────────────────────────────────────────────────────────
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (status = 'active' AND deleted_at IS NULL);

CREATE POLICY "products_owner_all" ON products
  USING (user_id = current_user_id());

-- ─── orders ───────────────────────────────────────────────────────────────────
-- Buyer sees their own orders; seller sees orders to their portfolio
CREATE POLICY "orders_buyer" ON orders
  FOR SELECT USING (buyer_id = current_user_id());

CREATE POLICY "orders_seller" ON orders
  USING (seller_id = current_user_id());

-- ─── payment_transactions ─────────────────────────────────────────────────────
CREATE POLICY "payment_transactions_seller" ON payment_transactions
  USING (
    order_id IN (SELECT id FROM orders WHERE seller_id = current_user_id())
  );

-- ─── courses ──────────────────────────────────────────────────────────────────
CREATE POLICY "courses_public_read" ON courses
  FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "courses_owner_all" ON courses
  USING (user_id = current_user_id());

-- ─── enrollments ──────────────────────────────────────────────────────────────
CREATE POLICY "enrollments_student" ON enrollments
  FOR SELECT USING (student_id = current_user_id());

CREATE POLICY "enrollments_instructor" ON enrollments
  USING (
    course_id IN (SELECT id FROM courses WHERE user_id = current_user_id())
  );

-- ─── social_accounts ──────────────────────────────────────────────────────────
CREATE POLICY "social_accounts_own" ON social_accounts
  USING (user_id = current_user_id());

-- All social post tables — owner only
CREATE POLICY "linkedin_posts_own"   ON linkedin_posts   USING (user_id = current_user_id());
CREATE POLICY "twitter_posts_own"    ON twitter_posts    USING (user_id = current_user_id());
CREATE POLICY "instagram_posts_own"  ON instagram_posts  USING (user_id = current_user_id());
CREATE POLICY "youtube_posts_own"    ON youtube_posts    USING (user_id = current_user_id());
CREATE POLICY "threads_posts_own"    ON threads_posts    USING (user_id = current_user_id());
CREATE POLICY "bluesky_posts_own"    ON bluesky_posts    USING (user_id = current_user_id());
CREATE POLICY "devto_posts_own"      ON devto_posts      USING (user_id = current_user_id());
CREATE POLICY "hashnode_posts_own"   ON hashnode_posts   USING (user_id = current_user_id());

-- ─── jobs ─────────────────────────────────────────────────────────────────────
CREATE POLICY "resume_versions_own"    ON resume_versions    USING (user_id = current_user_id());
CREATE POLICY "job_search_configs_own" ON job_search_configs USING (user_id = current_user_id());
CREATE POLICY "job_listings_own"       ON job_listings       USING (user_id = current_user_id());
CREATE POLICY "job_applications_own"   ON job_applications   USING (user_id = current_user_id());

-- ─── newsletter ────────────────────────────────────────────────────────────────
CREATE POLICY "newsletters_own" ON newsletters
  USING (user_id = current_user_id());

CREATE POLICY "newsletter_subscribers_own" ON newsletter_subscribers
  USING (
    newsletter_id IN (SELECT id FROM newsletters WHERE user_id = current_user_id())
  );

CREATE POLICY "newsletter_campaigns_own" ON newsletter_campaigns
  USING (
    newsletter_id IN (SELECT id FROM newsletters WHERE user_id = current_user_id())
  );

-- ─── booking ──────────────────────────────────────────────────────────────────
CREATE POLICY "meeting_types_public_read" ON meeting_types
  FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "meeting_types_owner_all" ON meeting_types
  USING (user_id = current_user_id());

CREATE POLICY "availability_rules_own" ON availability_rules
  USING (user_id = current_user_id());

CREATE POLICY "booking_appointments_host" ON booking_appointments
  USING (user_id = current_user_id());

-- ─── AI ───────────────────────────────────────────────────────────────────────
CREATE POLICY "ai_credit_ledger_own"    ON ai_credit_ledger    USING (user_id = current_user_id());
CREATE POLICY "ai_workflows_own"        ON ai_workflows        USING (user_id = current_user_id());
CREATE POLICY "oracle_connections_own"  ON oracle_connections  USING (user_id = current_user_id());
CREATE POLICY "brand_health_scores_own" ON brand_health_scores USING (user_id = current_user_id());
CREATE POLICY "research_reports_own"    ON research_reports    USING (user_id = current_user_id());

-- ─── teams ────────────────────────────────────────────────────────────────────
CREATE POLICY "teams_member_read" ON teams
  FOR SELECT USING (
    id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id() AND status = 'active')
    OR owner_id = current_user_id()
  );

CREATE POLICY "teams_owner_write" ON teams
  FOR ALL USING (owner_id = current_user_id());

CREATE POLICY "team_members_own_team" ON team_members
  USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = current_user_id())
    OR user_id = current_user_id()
  );

-- ─── platform ─────────────────────────────────────────────────────────────────
CREATE POLICY "subscriptions_own"           ON subscriptions           USING (user_id = current_user_id());
CREATE POLICY "referral_codes_own"          ON referral_codes          USING (user_id = current_user_id());
CREATE POLICY "notifications_own"           ON notifications           USING (user_id = current_user_id());
CREATE POLICY "notification_preferences_own" ON notification_preferences USING (user_id = current_user_id());
CREATE POLICY "push_subscriptions_own"      ON push_subscriptions      USING (user_id = current_user_id());
CREATE POLICY "mcp_sessions_own"            ON mcp_sessions            USING (user_id = current_user_id());

-- ─── Audit log — INSERT only, no SELECT/UPDATE/DELETE for app role ────────────
-- audit_logs deliberately has NO SELECT policy for the app role.
-- Only a privileged admin role (bypasses RLS) can read audit logs.
CREATE POLICY "audit_logs_insert_only" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- ─── mcp_tool_calls ───────────────────────────────────────────────────────────
CREATE POLICY "mcp_tool_calls_own" ON mcp_tool_calls
  USING (user_id = current_user_id());

-- ─── ai_usage_logs ────────────────────────────────────────────────────────────
CREATE POLICY "ai_usage_logs_own" ON ai_usage_logs
  USING (user_id = current_user_id());

-- ─── ai_workflow_runs ─────────────────────────────────────────────────────────
CREATE POLICY "ai_workflow_runs_own" ON ai_workflow_runs
  USING (
    workflow_id IN (SELECT id FROM ai_workflows WHERE user_id = current_user_id())
  );

-- ─── subscription_events ──────────────────────────────────────────────────────
CREATE POLICY "subscription_events_own" ON subscription_events
  USING (user_id = current_user_id());

-- ─── referrals ────────────────────────────────────────────────────────────────
-- Referrer can see all their referrals; referred user can see their own entry
CREATE POLICY "referrals_own" ON referrals
  USING (referrer_id = current_user_id() OR referred_user_id = current_user_id());

-- ─── newsletter_campaign_events ───────────────────────────────────────────────
CREATE POLICY "newsletter_campaign_events_own" ON newsletter_campaign_events
  USING (
    campaign_id IN (
      SELECT nc.id FROM newsletter_campaigns nc
      JOIN newsletters n ON n.id = nc.newsletter_id
      WHERE n.user_id = current_user_id()
    )
  );

-- ─── content_workflow_runs ────────────────────────────────────────────────────
CREATE POLICY "content_workflow_runs_own" ON content_workflow_runs
  USING (
    workflow_id IN (SELECT id FROM content_workflows WHERE user_id = current_user_id())
  );

-- ─── analytics_events ─────────────────────────────────────────────────────────
-- Portfolio owner reads their own events; public cannot query analytics directly
CREATE POLICY "analytics_events_own" ON analytics_events
  USING (user_id = current_user_id());

-- ─── cold_emails ──────────────────────────────────────────────────────────────
CREATE POLICY "cold_emails_own" ON cold_emails
  USING (user_id = current_user_id());

-- ─── quiz_questions ───────────────────────────────────────────────────────────
-- Course owner has full access; enrolled students can read
CREATE POLICY "quiz_questions_owner" ON quiz_questions
  USING (
    quiz_id IN (
      SELECT q.id FROM quizzes q
      JOIN lessons l ON l.id = q.lesson_id
      JOIN courses c ON c.id = l.course_id
      WHERE c.user_id = current_user_id()
    )
  );

CREATE POLICY "quiz_questions_enrolled_read" ON quiz_questions
  FOR SELECT USING (
    quiz_id IN (
      SELECT q.id FROM quizzes q
      JOIN lessons l ON l.id = q.lesson_id
      JOIN enrollments e ON e.course_id = l.course_id
      WHERE e.student_id = current_user_id() AND e.status = 'active'
    )
  );

-- ─── quiz_question_options ────────────────────────────────────────────────────
CREATE POLICY "quiz_question_options_owner" ON quiz_question_options
  USING (
    question_id IN (
      SELECT qq.id FROM quiz_questions qq
      JOIN quizzes q ON q.id = qq.quiz_id
      JOIN lessons l ON l.id = q.lesson_id
      JOIN courses c ON c.id = l.course_id
      WHERE c.user_id = current_user_id()
    )
  );

CREATE POLICY "quiz_question_options_enrolled_read" ON quiz_question_options
  FOR SELECT USING (
    question_id IN (
      SELECT qq.id FROM quiz_questions qq
      JOIN quizzes q ON q.id = qq.quiz_id
      JOIN lessons l ON l.id = q.lesson_id
      JOIN enrollments e ON e.course_id = l.course_id
      WHERE e.student_id = current_user_id() AND e.status = 'active'
    )
  );

-- ─── Commerce: order children ─────────────────────────────────────────────────
CREATE POLICY "order_items_buyer_seller" ON order_items
  USING (
    order_id IN (
      SELECT id FROM orders WHERE buyer_id = current_user_id() OR seller_id = current_user_id()
    )
  );

CREATE POLICY "order_shipments_seller" ON order_shipments
  USING (
    order_id IN (SELECT id FROM orders WHERE seller_id = current_user_id())
  );

CREATE POLICY "refunds_buyer_seller" ON refunds
  USING (
    order_id IN (
      SELECT id FROM orders WHERE buyer_id = current_user_id() OR seller_id = current_user_id()
    )
  );

CREATE POLICY "shipping_addresses_own" ON shipping_addresses
  USING (user_id = current_user_id());

-- ─── Commerce: product children ───────────────────────────────────────────────
CREATE POLICY "product_attr_defs_public_read" ON product_attribute_definitions
  FOR SELECT USING (
    product_id IN (SELECT id FROM products WHERE status = 'active' AND deleted_at IS NULL)
  );

CREATE POLICY "product_attr_defs_owner_all" ON product_attribute_definitions
  USING (
    product_id IN (SELECT id FROM products WHERE user_id = current_user_id())
  );

CREATE POLICY "product_variants_public_read" ON product_variants
  FOR SELECT USING (
    product_id IN (SELECT id FROM products WHERE status = 'active' AND deleted_at IS NULL)
    AND deleted_at IS NULL
  );

CREATE POLICY "product_variants_owner_all" ON product_variants
  USING (
    product_id IN (SELECT id FROM products WHERE user_id = current_user_id())
  );

-- Digital files: delivered to buyers of a completed order; managed by product owner
CREATE POLICY "digital_product_files_owner" ON digital_product_files
  USING (
    product_id IN (SELECT id FROM products WHERE user_id = current_user_id())
  );

CREATE POLICY "digital_product_files_buyer_read" ON digital_product_files
  FOR SELECT USING (
    product_id IN (
      SELECT oi.product_id FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.buyer_id = current_user_id()
        AND o.status IN ('confirmed', 'processing', 'delivered')
        AND o.deleted_at IS NULL
    )
  );

-- ─── Commerce: reviews, testimonials, payouts ─────────────────────────────────
CREATE POLICY "product_reviews_public_read" ON product_reviews
  FOR SELECT USING (status = 'approved' AND deleted_at IS NULL);

CREATE POLICY "product_reviews_reviewer" ON product_reviews
  USING (reviewer_id = current_user_id());

CREATE POLICY "product_reviews_product_owner_read" ON product_reviews
  FOR SELECT USING (
    product_id IN (SELECT id FROM products WHERE user_id = current_user_id())
  );

CREATE POLICY "testimonials_public_read" ON testimonials
  FOR SELECT USING (is_public = true AND deleted_at IS NULL);

CREATE POLICY "testimonials_portfolio_owner" ON testimonials
  USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = current_user_id())
  );

CREATE POLICY "payout_accounts_own" ON payout_accounts
  USING (user_id = current_user_id());

CREATE POLICY "payouts_own" ON payouts
  USING (user_id = current_user_id());

-- ─── LMS: course children ─────────────────────────────────────────────────────
CREATE POLICY "course_sections_owner" ON course_sections
  USING (
    course_id IN (SELECT id FROM courses WHERE user_id = current_user_id())
  );

CREATE POLICY "course_sections_enrolled_read" ON course_sections
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments
      WHERE student_id = current_user_id() AND status = 'active'
    )
  );

CREATE POLICY "course_sections_preview_read" ON course_sections
  FOR SELECT USING (
    is_preview = true AND deleted_at IS NULL AND
    course_id IN (SELECT id FROM courses WHERE status = 'published' AND deleted_at IS NULL)
  );

CREATE POLICY "lessons_owner" ON lessons
  USING (
    course_id IN (SELECT id FROM courses WHERE user_id = current_user_id())
  );

CREATE POLICY "lessons_enrolled_read" ON lessons
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments
      WHERE student_id = current_user_id() AND status = 'active'
    )
  );

CREATE POLICY "lessons_preview_read" ON lessons
  FOR SELECT USING (is_preview = true AND deleted_at IS NULL);

CREATE POLICY "lesson_videos_owner" ON lesson_videos
  USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE c.user_id = current_user_id()
    )
  );

CREATE POLICY "lesson_videos_enrolled_read" ON lesson_videos
  FOR SELECT USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN enrollments e ON e.course_id = l.course_id
      WHERE e.student_id = current_user_id() AND e.status = 'active'
    )
  );

CREATE POLICY "lesson_attachments_owner" ON lesson_attachments
  USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE c.user_id = current_user_id()
    )
  );

CREATE POLICY "lesson_attachments_enrolled_read" ON lesson_attachments
  FOR SELECT USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN enrollments e ON e.course_id = l.course_id
      WHERE e.student_id = current_user_id() AND e.status = 'active'
    )
  );

CREATE POLICY "cohorts_owner" ON cohorts
  USING (
    course_id IN (SELECT id FROM courses WHERE user_id = current_user_id())
  );

CREATE POLICY "cohorts_enrolled_read" ON cohorts
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments
      WHERE student_id = current_user_id() AND status = 'active'
    )
  );

CREATE POLICY "course_coupons_own" ON course_coupons
  USING (user_id = current_user_id());

CREATE POLICY "course_affiliates_own" ON course_affiliates
  USING (
    course_id IN (SELECT id FROM courses WHERE user_id = current_user_id())
    OR affiliate_id = current_user_id()
  );

CREATE POLICY "course_discussions_owner" ON course_discussions
  USING (
    course_id IN (SELECT id FROM courses WHERE user_id = current_user_id())
  );

CREATE POLICY "course_discussions_own_post" ON course_discussions
  FOR ALL USING (author_id = current_user_id());

CREATE POLICY "course_discussions_enrolled_read" ON course_discussions
  FOR SELECT USING (
    deleted_at IS NULL AND
    course_id IN (
      SELECT course_id FROM enrollments
      WHERE student_id = current_user_id() AND status = 'active'
    )
  );

-- ─── LMS: progress, certificates, quizzes ────────────────────────────────────
CREATE POLICY "lesson_progress_student" ON lesson_progress
  USING (student_id = current_user_id());

CREATE POLICY "lesson_progress_instructor_read" ON lesson_progress
  FOR SELECT USING (
    enrollment_id IN (
      SELECT e.id FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE c.user_id = current_user_id()
    )
  );

CREATE POLICY "certificates_student_read" ON certificates
  FOR SELECT USING (student_id = current_user_id());

CREATE POLICY "certificates_instructor" ON certificates
  USING (
    course_id IN (SELECT id FROM courses WHERE user_id = current_user_id())
  );

CREATE POLICY "quizzes_owner" ON quizzes
  USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE c.user_id = current_user_id()
    )
  );

CREATE POLICY "quizzes_enrolled_read" ON quizzes
  FOR SELECT USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN enrollments e ON e.course_id = l.course_id
      WHERE e.student_id = current_user_id() AND e.status = 'active'
    )
  );

CREATE POLICY "quiz_attempts_student" ON quiz_attempts
  USING (student_id = current_user_id());

CREATE POLICY "quiz_attempts_instructor_read" ON quiz_attempts
  FOR SELECT USING (
    quiz_id IN (
      SELECT q.id FROM quizzes q
      JOIN lessons l ON l.id = q.lesson_id
      JOIN courses c ON c.id = l.course_id
      WHERE c.user_id = current_user_id()
    )
  );

-- ─── Social: voice model, content workflows ───────────────────────────────────
CREATE POLICY "voice_model_samples_own" ON voice_model_samples
  USING (user_id = current_user_id());

CREATE POLICY "content_workflows_own" ON content_workflows
  USING (user_id = current_user_id());

-- ─── Jobs: cover letters, interview preps ─────────────────────────────────────
CREATE POLICY "cover_letters_own"    ON cover_letters    USING (user_id = current_user_id());
CREATE POLICY "interview_preps_own"  ON interview_preps  USING (user_id = current_user_id());

-- ─── Booking: availability exceptions, booking payments ───────────────────────
CREATE POLICY "availability_exceptions_own" ON availability_exceptions
  USING (user_id = current_user_id());

CREATE POLICY "booking_payments_host" ON booking_payments
  USING (
    appointment_id IN (SELECT id FROM booking_appointments WHERE user_id = current_user_id())
  );

-- ─── AI: topup packs ──────────────────────────────────────────────────────────
CREATE POLICY "ai_topup_packs_own" ON ai_topup_packs
  USING (user_id = current_user_id());

-- ─── Teams: permissions, agency clients ──────────────────────────────────────
CREATE POLICY "team_permissions_owner" ON team_permissions
  USING (
    team_member_id IN (
      SELECT tm.id FROM team_members tm
      JOIN teams t ON t.id = tm.team_id
      WHERE t.owner_id = current_user_id()
    )
  );

CREATE POLICY "team_permissions_self_read" ON team_permissions
  FOR SELECT USING (
    team_member_id IN (SELECT id FROM team_members WHERE user_id = current_user_id())
  );

CREATE POLICY "agency_clients_own" ON agency_clients
  USING (
    agency_team_id IN (SELECT id FROM teams WHERE owner_id = current_user_id())
    OR client_user_id = current_user_id()
  );

-- ─── Platform: verifications ──────────────────────────────────────────────────
CREATE POLICY "verifications_own" ON verifications
  USING (user_id = current_user_id());

-- ─── Write-path fixes for public (unauthenticated) actors ────────────────────
-- Analytics events are written by anonymous portfolio visitors — no user context
CREATE POLICY "analytics_events_public_insert" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Newsletter subscribe works without an account
CREATE POLICY "newsletter_subscribers_public_subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
