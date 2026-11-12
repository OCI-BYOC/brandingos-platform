import "dotenv/config";
import { createDb, withRLS } from "./index.js";
import { users } from "./schema/users.js";
import { portfolios, portfolioSections } from "./schema/portfolios.js";
import { products } from "./schema/commerce/products.js";
import { courses } from "./schema/courses/courses.js";

const TEST_USERS = [
  {
    id: "user_seed_2free0000000001",
    username: "seed_alice",
    email: "seed_alice@brandingos.dev",
    fullName: "Alice Free",
    tier: "free" as const,
    aiCreditsRemaining: 50,
    aiCreditsMonthlyAlloc: 50,
  },
  {
    id: "user_seed_2pro00000000001",
    username: "seed_bob",
    email: "seed_bob@brandingos.dev",
    fullName: "Bob Pro",
    tier: "pro" as const,
    aiCreditsRemaining: 200,
    aiCreditsMonthlyAlloc: 200,
  },
  {
    id: "user_seed_2growth00000001",
    username: "seed_carol",
    email: "seed_carol@brandingos.dev",
    fullName: "Carol Growth",
    tier: "growth" as const,
    aiCreditsRemaining: 500,
    aiCreditsMonthlyAlloc: 500,
  },
  {
    id: "user_seed_2brand0000000001",
    username: "seed_dave",
    email: "seed_dave@brandingos.dev",
    fullName: "Dave Brand",
    tier: "brand" as const,
    aiCreditsRemaining: 2000,
    aiCreditsMonthlyAlloc: 2000,
  },
] as const;

const THEMES = ["minimal", "modern", "creative"] as const;

async function seedUser(db: ReturnType<typeof createDb>, userId: string, index: number) {
  await withRLS(db, userId, async (tx) => {
    // Portfolio
    const [portfolio] = await tx
      .insert(portfolios)
      .values({
        userId,
        slug: `seed-portfolio-${index}`,
        theme: THEMES[index % 3],
        isPublished: true,
        isPrimary: true,
      })
      .returning({ id: portfolios.id });

    // Portfolio sections
    await tx.insert(portfolioSections).values([
      { portfolioId: portfolio.id, type: "hero" as const, order: 0, isVisible: true },
      { portfolioId: portfolio.id, type: "about" as const, order: 1, isVisible: true },
      { portfolioId: portfolio.id, type: "skills" as const, order: 2, isVisible: true },
    ]);

    // Digital product
    await tx.insert(products).values({
      userId,
      portfolioId: portfolio.id,
      title: `Seed Digital Product ${index + 1}`,
      type: "digital" as const,
      price: (index + 1) * 999,
      currency: "INR",
      status: "active" as const,
    });

    // Physical product
    await tx.insert(products).values({
      userId,
      portfolioId: portfolio.id,
      title: `Seed Physical Product ${index + 1}`,
      type: "physical" as const,
      price: (index + 1) * 1499,
      currency: "INR",
      status: "active" as const,
      shippingRequired: true,
    });

    // Course
    await tx.insert(courses).values({
      userId,
      title: `Seed Course ${index + 1}: Getting Started`,
      slug: `seed-course-${index + 1}`,
      tagline: "A seed course for development testing",
      level: "beginner" as const,
      language: "en",
      status: "published" as const,
      deliveryType: "self_paced" as const,
      pricingModel: "one_time" as const,
      price: (index + 1) * 2999,
      currency: "INR",
    });
  });
}

function log(msg: string) {
  process.stdout.write(msg + "\n");
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    process.stderr.write("DATABASE_URL is not set — add it to packages/db/.env.local\n");
    process.exit(1);
  }

  const db = createDb(url);
  log("Seeding test users…");

  // Insert all users first (outside RLS — seed runs with service role)
  await db.insert(users).values([...TEST_USERS]).onConflictDoNothing();
  log(`  ✓ ${TEST_USERS.length} users upserted`);

  // Seed per-user data inside RLS context
  for (let i = 0; i < TEST_USERS.length; i++) {
    const user = TEST_USERS[i];
    await seedUser(db, user.id, i);
    log(`  ✓ ${user.fullName} (${user.tier}) — portfolio, 2 products, 1 course`);
  }

  log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(1);
});
