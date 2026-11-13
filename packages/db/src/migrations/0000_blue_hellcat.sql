CREATE TYPE "public"."tier" AS ENUM('free', 'pro', 'growth', 'brand');--> statement-breakpoint
CREATE TYPE "public"."portfolio_section_type" AS ENUM('hero', 'about', 'skills', 'work', 'education', 'projects', 'integrations', 'testimonials', 'newsletter', 'booking', 'contact', 'custom');--> statement-breakpoint
CREATE TYPE "public"."portfolio_theme" AS ENUM('minimal', 'modern', 'creative');--> statement-breakpoint
CREATE TYPE "public"."integration_provider" AS ENUM('github', 'linkedin', 'twitter', 'instagram', 'youtube', 'threads', 'bluesky', 'devto', 'hashnode');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('digital', 'physical', 'printful');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('razorpay', 'stripe', 'cod');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'authorized', 'captured', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('pending', 'approved', 'rejected', 'processed');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."cohort_status" AS ENUM('upcoming', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."course_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."course_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."course_delivery" AS ENUM('self_paced', 'cohort', 'drip');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('active', 'completed', 'refunded', 'expired');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('video', 'text', 'quiz', 'live', 'assignment');--> statement-breakpoint
CREATE TYPE "public"."course_pricing" AS ENUM('free', 'one_time', 'subscription');--> statement-breakpoint
CREATE TYPE "public"."video_status" AS ENUM('pending', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."quiz_question_type" AS ENUM('multiple_choice', 'true_false', 'short_answer');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'scheduled', 'published', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."social_platform" AS ENUM('linkedin', 'twitter', 'instagram', 'youtube', 'threads', 'bluesky', 'devto', 'hashnode');--> statement-breakpoint
CREATE TYPE "public"."resume_compile_status" AS ENUM('pending', 'compiling', 'compiled', 'failed');--> statement-breakpoint
CREATE TYPE "public"."campaign_event_type" AS ENUM('sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'complained');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'scheduled', 'sending', 'sent', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."subscriber_status" AS ENUM('pending', 'subscribed', 'unsubscribed', 'bounced', 'complained');--> statement-breakpoint
CREATE TYPE "public"."availability_exception_type" AS ENUM('unavailable', 'custom_hours');--> statement-breakpoint
CREATE TYPE "public"."booking_location" AS ENUM('zoom', 'google_meet', 'phone', 'in_person', 'custom');--> statement-breakpoint
CREATE TYPE "public"."booking_payment_status" AS ENUM('pending', 'paid', 'refunded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."ai_agent_type" AS ENUM('social', 'job', 'research', 'brand', 'custom');--> statement-breakpoint
CREATE TYPE "public"."ai_call_status" AS ENUM('success', 'failed', 'timeout');--> statement-breakpoint
CREATE TYPE "public"."ai_provider" AS ENUM('ollama', 'anthropic', 'openai');--> statement-breakpoint
CREATE TYPE "public"."credit_ledger_type" AS ENUM('monthly_allocation', 'topup_purchase', 'consumption', 'refund', 'adjustment', 'expiry');--> statement-breakpoint
CREATE TYPE "public"."oracle_connection_status" AS ENUM('pending', 'provisioning', 'active', 'failed', 'disconnected');--> statement-breakpoint
CREATE TYPE "public"."oracle_health_status" AS ENUM('healthy', 'degraded', 'offline');--> statement-breakpoint
CREATE TYPE "public"."team_member_role" AS ENUM('owner', 'admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."team_member_status" AS ENUM('pending', 'active', 'suspended', 'removed');--> statement-breakpoint
CREATE TYPE "public"."team_type" AS ENUM('personal', 'agency');--> statement-breakpoint
CREATE TYPE "public"."subscription_provider" AS ENUM('stripe', 'razorpay');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'past_due', 'cancelled', 'trialing', 'paused');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'approved', 'rejected', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('creator', 'skill', 'income');--> statement-breakpoint
CREATE TYPE "public"."webhook_status" AS ENUM('received', 'processed', 'failed', 'duplicate');--> statement-breakpoint
CREATE TYPE "public"."mcp_call_status" AS ENUM('success', 'failed', 'permission_denied');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"tier" "tier" DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"razorpay_customer_id" text,
	"billing_cycle_start" timestamp with time zone,
	"ai_credits_remaining" integer DEFAULT 50 NOT NULL,
	"ai_credits_monthly_alloc" integer DEFAULT 50 NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "users_razorpay_customer_id_unique" UNIQUE("razorpay_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portfolio_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"type" "portfolio_section_type" NOT NULL,
	"title" text,
	"order" integer DEFAULT 0 NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portfolios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text,
	"tagline" text,
	"bio" text,
	"location" text,
	"avatar_url" text,
	"cover_url" text,
	"theme" "portfolio_theme" DEFAULT 'minimal' NOT NULL,
	"custom_css" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"meta_title" text,
	"meta_description" text,
	"og_image_url" text,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"provider" "integration_provider" NOT NULL,
	"external_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp with time zone,
	"data" jsonb DEFAULT '{}'::jsonb,
	"last_synced_at" timestamp with time zone,
	"sync_enabled" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"user_id" text,
	"event_type" text NOT NULL,
	"path" text,
	"referrer" text,
	"country" text,
	"city" text,
	"device" text,
	"browser" text,
	"os" text,
	"is_unique" boolean DEFAULT false NOT NULL,
	"session_id" text,
	"data" jsonb DEFAULT '{}'::jsonb,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_product_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"r2_key" text NOT NULL,
	"size_bytes" integer,
	"mime_type" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_attribute_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"values" text[] NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" text,
	"price" integer,
	"compare_at_price" integer,
	"stock_quantity" integer,
	"attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"image_url" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"type" "product_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"compare_at_price" integer,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"is_on_marketplace" boolean DEFAULT false NOT NULL,
	"stock_quantity" integer,
	"low_stock_threshold" integer,
	"cover_image_url" text,
	"image_urls" text[],
	"tags" text[],
	"weight" integer,
	"dimensions" jsonb,
	"shipping_required" boolean DEFAULT false NOT NULL,
	"printful_product_id" text,
	"seo_title" text,
	"seo_description" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid,
	"variant_id" uuid,
	"course_id" uuid,
	"title" text NOT NULL,
	"price" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"carrier" text,
	"tracking_number" text,
	"tracking_url" text,
	"status" text,
	"estimated_delivery" timestamp with time zone,
	"shipped_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"buyer_id" text,
	"buyer_email" text NOT NULL,
	"buyer_name" text NOT NULL,
	"seller_id" text NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"subtotal_amount" integer NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"shipping_amount" integer DEFAULT 0 NOT NULL,
	"tax_amount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"coupon_code" text,
	"notes" text,
	"shipping_address_id" uuid,
	"payment_method" "payment_method",
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_payment_id" text NOT NULL,
	"provider_capture_id" text,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"platform_fee_amount" integer DEFAULT 0 NOT NULL,
	"seller_amount" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transactions_provider_payment_id_unique" UNIQUE("provider_payment_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"payment_transaction_id" uuid,
	"amount" integer NOT NULL,
	"reason" text,
	"status" "refund_status" DEFAULT 'pending' NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipping_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text DEFAULT 'IN' NOT NULL,
	"phone" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payout_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"account_type" text,
	"account_details" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_payout_id" text,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"initiated_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"order_id" uuid,
	"reviewer_id" text NOT NULL,
	"rating" integer NOT NULL,
	"title" text,
	"body" text,
	"is_verified_purchase" boolean DEFAULT false NOT NULL,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"client_name" text NOT NULL,
	"client_title" text,
	"client_company" text,
	"client_avatar_url" text,
	"body" text NOT NULL,
	"rating" integer,
	"verification_email" text,
	"verification_token" text,
	"verified_at" timestamp with time zone,
	"is_public" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cohorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"name" text NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"max_enrollments" integer,
	"enrollment_count" integer DEFAULT 0 NOT NULL,
	"status" "cohort_status" DEFAULT 'upcoming' NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_affiliates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"affiliate_id" text NOT NULL,
	"referral_code" text NOT NULL,
	"commission_rate" integer DEFAULT 10 NOT NULL,
	"earnings_total" integer DEFAULT 0 NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"conversion_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_affiliates_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid,
	"user_id" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"value" integer NOT NULL,
	"max_redemptions" integer,
	"redemption_count" integer DEFAULT 0 NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL,
	"is_preview" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"tagline" text,
	"description" text,
	"cover_image_url" text,
	"preview_video_url" text,
	"level" "course_level" DEFAULT 'beginner' NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"status" "course_status" DEFAULT 'draft' NOT NULL,
	"delivery_type" "course_delivery" DEFAULT 'self_paced' NOT NULL,
	"pricing_model" "course_pricing" DEFAULT 'one_time' NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"total_lessons" integer DEFAULT 0 NOT NULL,
	"total_duration_seconds" integer DEFAULT 0 NOT NULL,
	"enrollment_count" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"requires_approval" boolean DEFAULT false NOT NULL,
	"certificate_enabled" boolean DEFAULT true NOT NULL,
	"discussion_enabled" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lesson_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"name" text NOT NULL,
	"r2_key" text NOT NULL,
	"size_bytes" integer,
	"mime_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lesson_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"status" "video_status" DEFAULT 'pending' NOT NULL,
	"original_r2_key" text,
	"hls_r2_prefix" text,
	"duration_seconds" integer,
	"resolutions" text[],
	"thumbnail_url" text,
	"processing_error" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "lesson_type" DEFAULT 'video' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"duration_seconds" integer,
	"is_preview" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"drip_days_after_enrollment" integer,
	"zoom_meeting_url" text,
	"google_meet_url" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"student_id" text NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"verification_code" text NOT NULL,
	"r2_key" text,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_discussions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"lesson_id" uuid,
	"author_id" text NOT NULL,
	"parent_id" uuid,
	"content" text NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"cohort_id" uuid,
	"student_id" text NOT NULL,
	"order_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"completion_percentage" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"last_accessed_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lesson_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"student_id" text NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"watched_seconds" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quiz_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"student_id" text NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"is_passed" boolean NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quiz_question_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quiz_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"type" "quiz_question_type" DEFAULT 'multiple_choice' NOT NULL,
	"question" text NOT NULL,
	"explanation" text,
	"points" integer DEFAULT 1 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"title" text NOT NULL,
	"passing_score" integer DEFAULT 70 NOT NULL,
	"allowed_attempts" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bluesky_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"social_account_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"external_post_id" text,
	"external_post_url" text,
	"media_urls" text[],
	"workflow_run_id" uuid,
	"error_message" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"analytics_last_fetched" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reply_to_post_uri" text,
	"reply_to_post_cid" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_workflow_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"input" jsonb DEFAULT '{}'::jsonb,
	"output" jsonb DEFAULT '{}'::jsonb,
	"error_message" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_workflows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"trigger" text NOT NULL,
	"trigger_config" jsonb DEFAULT '{}'::jsonb,
	"steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp with time zone,
	"run_count" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "devto_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"social_account_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"external_post_id" text,
	"external_post_url" text,
	"media_urls" text[],
	"workflow_run_id" uuid,
	"error_message" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"analytics_last_fetched" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"tags" text[],
	"canonical_url" text,
	"main_image" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"external_slug" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hashnode_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"social_account_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"external_post_id" text,
	"external_post_url" text,
	"media_urls" text[],
	"workflow_run_id" uuid,
	"error_message" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"analytics_last_fetched" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"tags" text[],
	"canonical_url" text,
	"main_image" text,
	"publication_id" text,
	"is_published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "instagram_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"social_account_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"external_post_id" text,
	"external_post_url" text,
	"media_urls" text[],
	"workflow_run_id" uuid,
	"error_message" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"analytics_last_fetched" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"post_type" text,
	"carousel_items" jsonb,
	"reel_audio_name" text,
	"location_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "linkedin_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"social_account_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"external_post_id" text,
	"external_post_url" text,
	"media_urls" text[],
	"workflow_run_id" uuid,
	"error_message" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"analytics_last_fetched" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"article_url" text,
	"article_title" text,
	"article_description" text,
	"post_type" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "social_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"platform" "social_platform" NOT NULL,
	"external_id" text NOT NULL,
	"username" text,
	"display_name" text,
	"profile_image_url" text,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threads_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"social_account_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"external_post_id" text,
	"external_post_url" text,
	"media_urls" text[],
	"workflow_run_id" uuid,
	"error_message" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"analytics_last_fetched" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reply_to_post_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "twitter_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"social_account_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"external_post_id" text,
	"external_post_url" text,
	"media_urls" text[],
	"workflow_run_id" uuid,
	"error_message" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"analytics_last_fetched" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reply_to_tweet_id" text,
	"is_thread" boolean DEFAULT false NOT NULL,
	"thread_parts" jsonb,
	"quote_tweet_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "voice_model_samples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"source_type" text NOT NULL,
	"source_id" text,
	"content" text NOT NULL,
	"content_type" text,
	"word_count" integer,
	"model_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "youtube_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"social_account_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"external_post_id" text,
	"external_post_url" text,
	"media_urls" text[],
	"workflow_run_id" uuid,
	"error_message" text,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"analytics_last_fetched" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"video_id" text,
	"community_post_type" text,
	"poll_options" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cold_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"job_listing_id" uuid,
	"recipient_name" text,
	"recipient_email" text,
	"recipient_linkedin_url" text,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cover_letters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"job_listing_id" uuid,
	"application_id" uuid,
	"content" text NOT NULL,
	"tone" text DEFAULT 'formal',
	"ai_generated" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interview_preps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"job_listing_id" uuid,
	"application_id" uuid,
	"questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"company_brief" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"job_listing_id" uuid,
	"resume_version_id" uuid,
	"stage" text DEFAULT 'bookmarked' NOT NULL,
	"applied_at" timestamp with time zone,
	"notes" text,
	"applied_via" text,
	"contact_email" text,
	"offered_salary" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"adzuna_job_id" text,
	"source_url" text,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"salary" jsonb,
	"description" text,
	"requirements" text[],
	"job_type" text,
	"is_remote" boolean DEFAULT false NOT NULL,
	"posted_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"ai_match_score" integer,
	"ai_match_notes" text,
	"search_config_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_search_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"keywords" text[],
	"locations" text[],
	"job_types" text[],
	"min_salary" integer,
	"max_salary" integer,
	"salary_currency" text DEFAULT 'INR',
	"exclude_keywords" text[],
	"company_sizes" text[],
	"is_active" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"target_role" text,
	"target_company" text,
	"latex_source" text,
	"latex_r2_key" text,
	"compiled_pdf_r2_key" text,
	"compiled_pdf_url" text,
	"compile_status" "resume_compile_status" DEFAULT 'pending' NOT NULL,
	"compile_error" text,
	"compiled_at" timestamp with time zone,
	"is_default" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletter_campaign_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"subscriber_id" uuid,
	"event_type" "campaign_event_type" NOT NULL,
	"clicked_url" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletter_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"newsletter_id" uuid NOT NULL,
	"subject" text NOT NULL,
	"preview_text" text,
	"html_content" text,
	"text_content" text,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"sent_count" integer DEFAULT 0 NOT NULL,
	"open_count" integer DEFAULT 0 NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"unsubscribe_count" integer DEFAULT 0 NOT NULL,
	"bounce_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"newsletter_id" uuid NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"status" "subscriber_status" DEFAULT 'pending' NOT NULL,
	"subscribed_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"unsubscribe_reason" text,
	"referral_source" text,
	"tags" text[],
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"portfolio_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"from_name" text NOT NULL,
	"from_email" text NOT NULL,
	"reply_to_email" text,
	"custom_domain" text,
	"subscriber_count" integer DEFAULT 0 NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "availability_exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"type" "availability_exception_type" NOT NULL,
	"start_time" text,
	"end_time" text,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "availability_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"meeting_type_id" uuid,
	"day_of_week" integer[] NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"valid_from" date,
	"valid_until" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking_appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"meeting_type_id" uuid,
	"guest_name" text NOT NULL,
	"guest_email" text NOT NULL,
	"guest_phone" text,
	"guest_notes" text,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"timezone" text NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"zoom_meeting_id" text,
	"google_meet_link" text,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"reminder_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"provider" text NOT NULL,
	"provider_payment_id" text,
	"status" "booking_payment_status" DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meeting_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"location" "booking_location" DEFAULT 'google_meet' NOT NULL,
	"location_details" text,
	"buffer_minutes_after" integer DEFAULT 0 NOT NULL,
	"max_advance_booking_days" integer DEFAULT 60 NOT NULL,
	"requires_approval" boolean DEFAULT false NOT NULL,
	"confirmation_message" text,
	"color" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_credit_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "credit_ledger_type" NOT NULL,
	"amount" integer NOT NULL,
	"description" text,
	"model" text,
	"related_entity_type" text,
	"related_entity_id" uuid,
	"balance_before" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"expires_at" timestamp with time zone,
	"topup_pack_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_topup_packs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"order_id" uuid,
	"credits" integer NOT NULL,
	"price" integer NOT NULL,
	"remaining_credits" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_usage_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"provider" "ai_provider" NOT NULL,
	"model" text NOT NULL,
	"action" text NOT NULL,
	"prompt_tokens" integer,
	"completion_tokens" integer,
	"total_tokens" integer,
	"credits_consumed" integer NOT NULL,
	"latency_ms" integer,
	"status" "ai_call_status" DEFAULT 'success' NOT NULL,
	"error_message" text,
	"related_entity_type" text,
	"related_entity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_workflow_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"input" jsonb DEFAULT '{}'::jsonb,
	"output" jsonb DEFAULT '{}'::jsonb,
	"error_message" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_workflows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"agent_type" "ai_agent_type" NOT NULL,
	"trigger" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp with time zone,
	"run_count" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brand_health_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"week_start" date NOT NULL,
	"overall_score" integer NOT NULL,
	"portfolio_views_score" integer NOT NULL,
	"newsletter_growth_score" integer NOT NULL,
	"social_engagement_score" integer NOT NULL,
	"brand_consistency_score" integer NOT NULL,
	"reputation_score" integer NOT NULL,
	"revenue_score" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oracle_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"status" "oracle_connection_status" DEFAULT 'pending' NOT NULL,
	"tenancy_ocid" text,
	"user_ocid" text,
	"api_key_fingerprint" text,
	"region_identifier" text,
	"instance_id" text,
	"instance_ip" text,
	"nomad_alloc_id" text,
	"last_health_check_at" timestamp with time zone,
	"health_status" "oracle_health_status",
	"error_message" text,
	"connected_at" timestamp with time zone,
	"disconnected_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "research_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"query" text,
	"content" text,
	"sources" jsonb DEFAULT '[]'::jsonb,
	"workflow_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agency_team_id" uuid NOT NULL,
	"client_user_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" text,
	"role" "team_member_role" DEFAULT 'viewer' NOT NULL,
	"invite_email" text,
	"invite_token" text,
	"invite_expires_at" timestamp with time zone,
	"status" "team_member_status" DEFAULT 'pending' NOT NULL,
	"joined_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_member_id" uuid NOT NULL,
	"feature" text NOT NULL,
	"portfolio_id" uuid,
	"is_allowed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"type" "team_type" DEFAULT 'personal' NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"whitelabel_domain" text,
	"whitelabel_name" text,
	"whitelabel_logo_url" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teams_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"code" text NOT NULL,
	"type" text DEFAULT 'user_referral' NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"earnings_total" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referral_code_id" uuid NOT NULL,
	"referrer_id" text NOT NULL,
	"referred_user_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reward_amount" integer,
	"converted_at" timestamp with time zone,
	"rewarded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"event_type" text NOT NULL,
	"from_tier" text,
	"to_tier" text,
	"amount" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"provider" "subscription_provider" NOT NULL,
	"provider_subscription_id" text NOT NULL,
	"tier" text NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"cancelled_at" timestamp with time zone,
	"trial_ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_provider_subscription_id_unique" UNIQUE("provider_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "verification_type" NOT NULL,
	"status" "verification_status" DEFAULT 'pending' NOT NULL,
	"evidence" jsonb DEFAULT '{}'::jsonb,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"channel" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"action_url" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"data" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"event_type" text NOT NULL,
	"external_event_id" text,
	"status" "webhook_status" DEFAULT 'received' NOT NULL,
	"payload" jsonb,
	"processing_error" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mcp_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"client_id" text NOT NULL,
	"access_token" text NOT NULL,
	"scopes" text[] NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_used_at" timestamp with time zone,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mcp_sessions_access_token_unique" UNIQUE("access_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mcp_tool_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"tool_name" text NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"status" "mcp_call_status" DEFAULT 'success' NOT NULL,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"target_user_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"changes" jsonb,
	"ip_address" text,
	"user_agent" text,
	"session_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio_sections" ADD CONSTRAINT "portfolio_sections_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integrations" ADD CONSTRAINT "integrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_product_files" ADD CONSTRAINT "digital_product_files_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_attribute_definitions" ADD CONSTRAINT "product_attribute_definitions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_shipments" ADD CONSTRAINT "order_shipments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_shipping_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."shipping_addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refunds" ADD CONSTRAINT "refunds_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_transaction_id_payment_transactions_id_fk" FOREIGN KEY ("payment_transaction_id") REFERENCES "public"."payment_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payout_accounts" ADD CONSTRAINT "payout_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payouts" ADD CONSTRAINT "payouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_affiliates" ADD CONSTRAINT "course_affiliates_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_affiliates" ADD CONSTRAINT "course_affiliates_affiliate_id_users_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_coupons" ADD CONSTRAINT "course_coupons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_coupons" ADD CONSTRAINT "course_coupons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_sections" ADD CONSTRAINT "course_sections_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_attachments" ADD CONSTRAINT "lesson_attachments_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_videos" ADD CONSTRAINT "lesson_videos_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_course_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."course_sections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificates" ADD CONSTRAINT "certificates_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificates" ADD CONSTRAINT "certificates_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_discussions" ADD CONSTRAINT "course_discussions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_discussions" ADD CONSTRAINT "course_discussions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_discussions" ADD CONSTRAINT "course_discussions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_cohort_id_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz_question_options" ADD CONSTRAINT "quiz_question_options_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bluesky_posts" ADD CONSTRAINT "bluesky_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bluesky_posts" ADD CONSTRAINT "bluesky_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content_workflow_runs" ADD CONSTRAINT "content_workflow_runs_workflow_id_content_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."content_workflows"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content_workflows" ADD CONSTRAINT "content_workflows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "devto_posts" ADD CONSTRAINT "devto_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "devto_posts" ADD CONSTRAINT "devto_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hashnode_posts" ADD CONSTRAINT "hashnode_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hashnode_posts" ADD CONSTRAINT "hashnode_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "linkedin_posts" ADD CONSTRAINT "linkedin_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "linkedin_posts" ADD CONSTRAINT "linkedin_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threads_posts" ADD CONSTRAINT "threads_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threads_posts" ADD CONSTRAINT "threads_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "twitter_posts" ADD CONSTRAINT "twitter_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "twitter_posts" ADD CONSTRAINT "twitter_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "voice_model_samples" ADD CONSTRAINT "voice_model_samples_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "youtube_posts" ADD CONSTRAINT "youtube_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "youtube_posts" ADD CONSTRAINT "youtube_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cold_emails" ADD CONSTRAINT "cold_emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cold_emails" ADD CONSTRAINT "cold_emails_job_listing_id_job_listings_id_fk" FOREIGN KEY ("job_listing_id") REFERENCES "public"."job_listings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_job_listing_id_job_listings_id_fk" FOREIGN KEY ("job_listing_id") REFERENCES "public"."job_listings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interview_preps" ADD CONSTRAINT "interview_preps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interview_preps" ADD CONSTRAINT "interview_preps_job_listing_id_job_listings_id_fk" FOREIGN KEY ("job_listing_id") REFERENCES "public"."job_listings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interview_preps" ADD CONSTRAINT "interview_preps_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_listing_id_job_listings_id_fk" FOREIGN KEY ("job_listing_id") REFERENCES "public"."job_listings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resume_version_id_resume_versions_id_fk" FOREIGN KEY ("resume_version_id") REFERENCES "public"."resume_versions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_search_config_id_job_search_configs_id_fk" FOREIGN KEY ("search_config_id") REFERENCES "public"."job_search_configs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_search_configs" ADD CONSTRAINT "job_search_configs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newsletter_campaign_events" ADD CONSTRAINT "newsletter_campaign_events_campaign_id_newsletter_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."newsletter_campaigns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newsletter_campaign_events" ADD CONSTRAINT "newsletter_campaign_events_subscriber_id_newsletter_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newsletter_campaigns" ADD CONSTRAINT "newsletter_campaigns_newsletter_id_newsletters_id_fk" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_newsletter_id_newsletters_id_fk" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_meeting_type_id_meeting_types_id_fk" FOREIGN KEY ("meeting_type_id") REFERENCES "public"."meeting_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_appointments" ADD CONSTRAINT "booking_appointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_appointments" ADD CONSTRAINT "booking_appointments_meeting_type_id_meeting_types_id_fk" FOREIGN KEY ("meeting_type_id") REFERENCES "public"."meeting_types"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_payments" ADD CONSTRAINT "booking_payments_appointment_id_booking_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."booking_appointments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_types" ADD CONSTRAINT "meeting_types_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_credit_ledger" ADD CONSTRAINT "ai_credit_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_topup_packs" ADD CONSTRAINT "ai_topup_packs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_usage_logs" ADD CONSTRAINT "ai_usage_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_workflow_runs" ADD CONSTRAINT "ai_workflow_runs_workflow_id_ai_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."ai_workflows"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_workflows" ADD CONSTRAINT "ai_workflows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "brand_health_scores" ADD CONSTRAINT "brand_health_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oracle_connections" ADD CONSTRAINT "oracle_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "research_reports" ADD CONSTRAINT "research_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "research_reports" ADD CONSTRAINT "research_reports_workflow_id_ai_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."ai_workflows"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_agency_team_id_teams_id_fk" FOREIGN KEY ("agency_team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_client_user_id_users_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_permissions" ADD CONSTRAINT "team_permissions_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referral_code_id_referral_codes_id_fk" FOREIGN KEY ("referral_code_id") REFERENCES "public"."referral_codes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verifications" ADD CONSTRAINT "verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mcp_sessions" ADD CONSTRAINT "mcp_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mcp_tool_calls" ADD CONSTRAINT "mcp_tool_calls_session_id_mcp_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."mcp_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mcp_tool_calls" ADD CONSTRAINT "mcp_tool_calls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_preferences_user_key_uniq" ON "user_preferences" USING btree ("user_id","key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_preferences_user_idx" ON "user_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "portfolio_sections_portfolio_idx" ON "portfolio_sections" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "portfolio_sections_order_idx" ON "portfolio_sections" USING btree ("portfolio_id","order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "portfolios_user_idx" ON "portfolios" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "portfolios_slug_idx" ON "portfolios" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "portfolios_user_slug_uniq" ON "portfolios" USING btree ("user_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "integrations_user_provider_uniq" ON "integrations" USING btree ("user_id","provider");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integrations_user_idx" ON "integrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_portfolio_idx" ON "analytics_events" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_type_idx" ON "analytics_events" USING btree ("portfolio_id","event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_occurred_idx" ON "analytics_events" USING btree ("portfolio_id","occurred_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_country_idx" ON "analytics_events" USING btree ("portfolio_id","country");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_files_product_idx" ON "digital_product_files" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prod_attr_defs_product_idx" ON "product_attribute_definitions" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_variants_product_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_user_idx" ON "products" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_portfolio_idx" ON "products" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_marketplace_idx" ON "products" USING btree ("is_on_marketplace","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_shipments_order_idx" ON "order_shipments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_seller_idx" ON "orders" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_buyer_idx" ON "orders" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_created_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_transactions_order_idx" ON "payment_transactions" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refunds_order_idx" ON "refunds" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipping_addresses_user_idx" ON "shipping_addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payout_accounts_user_idx" ON "payout_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payouts_user_idx" ON "payouts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_reviews_product_idx" ON "product_reviews" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_reviews_reviewer_idx" ON "product_reviews" USING btree ("reviewer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_reviews_status_idx" ON "product_reviews" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "testimonials_portfolio_idx" ON "testimonials" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cohorts_course_idx" ON "cohorts" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_affiliates_course_idx" ON "course_affiliates" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "course_affiliates_uniq" ON "course_affiliates" USING btree ("course_id","affiliate_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_sections_course_idx" ON "course_sections" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "courses_user_idx" ON "courses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "courses_status_idx" ON "courses" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "courses_user_slug_uniq" ON "courses" USING btree ("user_id","slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lessons_section_idx" ON "lessons" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lessons_course_idx" ON "lessons" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "certificates_course_student_uniq" ON "certificates" USING btree ("course_id","student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_discussions_course_idx" ON "course_discussions" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_discussions_lesson_idx" ON "course_discussions" USING btree ("lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "enrollments_course_student_uniq" ON "enrollments" USING btree ("course_id","student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollments_student_idx" ON "enrollments" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollments_course_idx" ON "enrollments" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "lesson_progress_enroll_lesson_uniq" ON "lesson_progress" USING btree ("enrollment_id","lesson_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lesson_progress_student_idx" ON "lesson_progress" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quiz_attempts_quiz_student_idx" ON "quiz_attempts" USING btree ("quiz_id","student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bluesky_posts_user_idx" ON "bluesky_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_workflows_user_idx" ON "content_workflows" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "devto_posts_user_idx" ON "devto_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hashnode_posts_user_idx" ON "hashnode_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instagram_posts_user_idx" ON "instagram_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "linkedin_posts_user_idx" ON "linkedin_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "linkedin_posts_status_idx" ON "linkedin_posts" USING btree ("status","scheduled_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "social_accounts_user_platform_uniq" ON "social_accounts" USING btree ("user_id","platform");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "social_accounts_user_idx" ON "social_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "threads_posts_user_idx" ON "threads_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "twitter_posts_user_idx" ON "twitter_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "twitter_posts_status_idx" ON "twitter_posts" USING btree ("status","scheduled_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "voice_model_samples_user_idx" ON "voice_model_samples" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "youtube_posts_user_idx" ON "youtube_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_applications_user_idx" ON "job_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_applications_stage_idx" ON "job_applications" USING btree ("user_id","stage");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_listings_user_adzuna_uniq" ON "job_listings" USING btree ("user_id","adzuna_job_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_listings_user_idx" ON "job_listings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_listings_score_idx" ON "job_listings" USING btree ("user_id","ai_match_score");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_search_configs_user_idx" ON "job_search_configs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resume_versions_user_idx" ON "resume_versions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nl_campaign_events_campaign_idx" ON "newsletter_campaign_events" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nl_campaign_events_subscriber_idx" ON "newsletter_campaign_events" USING btree ("subscriber_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nl_campaign_events_type_idx" ON "newsletter_campaign_events" USING btree ("campaign_id","event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "newsletter_campaigns_nl_idx" ON "newsletter_campaigns" USING btree ("newsletter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "newsletter_campaigns_status_idx" ON "newsletter_campaigns" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_subscribers_nl_email_uniq" ON "newsletter_subscribers" USING btree ("newsletter_id","email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "newsletter_subscribers_status_idx" ON "newsletter_subscribers" USING btree ("newsletter_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "newsletters_user_idx" ON "newsletters" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "availability_exceptions_user_date_idx" ON "availability_exceptions" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "availability_rules_user_idx" ON "availability_rules" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_appointments_user_idx" ON "booking_appointments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_appointments_status_idx" ON "booking_appointments" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_appointments_time_idx" ON "booking_appointments" USING btree ("user_id","start_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meeting_types_user_idx" ON "meeting_types" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "meeting_types_user_slug_uniq" ON "meeting_types" USING btree ("user_id","slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_credit_ledger_user_idx" ON "ai_credit_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_credit_ledger_type_idx" ON "ai_credit_ledger" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_credit_ledger_created_idx" ON "ai_credit_ledger" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_topup_packs_user_idx" ON "ai_topup_packs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_usage_logs_user_idx" ON "ai_usage_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_usage_logs_action_idx" ON "ai_usage_logs" USING btree ("user_id","action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_usage_logs_created_idx" ON "ai_usage_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_workflows_user_idx" ON "ai_workflows" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "brand_health_scores_user_week_uniq" ON "brand_health_scores" USING btree ("user_id","week_start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "brand_health_scores_user_idx" ON "brand_health_scores" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "oracle_connections_user_idx" ON "oracle_connections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "research_reports_user_idx" ON "research_reports" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agency_clients_agency_client_uniq" ON "agency_clients" USING btree ("agency_team_id","client_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agency_clients_agency_idx" ON "agency_clients" USING btree ("agency_team_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "team_members_team_user_uniq" ON "team_members" USING btree ("team_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_members_team_idx" ON "team_members" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_members_user_idx" ON "team_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "team_permissions_member_feature_portfolio_uniq" ON "team_permissions" USING btree ("team_member_id","feature","portfolio_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_permissions_member_idx" ON "team_permissions" USING btree ("team_member_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_owner_idx" ON "teams" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referral_codes_user_idx" ON "referral_codes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referrals_referrer_idx" ON "referrals" USING btree ("referrer_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "referrals_referred_user_uniq" ON "referrals" USING btree ("referred_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_events_subscription_idx" ON "subscription_events" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_events_user_idx" ON "subscription_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verifications_user_idx" ON "verifications" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "notif_prefs_user_type_channel_uniq" ON "notification_preferences" USING btree ("user_id","type","channel");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notif_prefs_user_idx" ON "notification_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_unread_idx" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "push_subscriptions_user_idx" ON "push_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_deliveries_provider_event_uniq" ON "webhook_deliveries" USING btree ("provider","external_event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_deliveries_status_idx" ON "webhook_deliveries" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_sessions_user_idx" ON "mcp_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_sessions_token_idx" ON "mcp_sessions" USING btree ("access_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_sessions_expiry_idx" ON "mcp_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_tool_calls_session_idx" ON "mcp_tool_calls" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_tool_calls_user_idx" ON "mcp_tool_calls" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_tool_calls_tool_idx" ON "mcp_tool_calls" USING btree ("tool_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_target_user_idx" ON "audit_logs" USING btree ("target_user_id");