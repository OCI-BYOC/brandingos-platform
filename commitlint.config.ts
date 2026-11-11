import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [
      "feat","fix","chore","refactor","perf","test",
      "docs","style","revert","infra","ai","db","sec"
    ]],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "scope-enum": [2, "always", [
      "portfolio","auth","commerce","marketplace","payments","lms",
      "booking","invoicing","events","referral","ai-router",
      "social-agent","job-agent","brand-agent","research-agent",
      "mcp","private-ai","infra","nomad","consul","vault",
      "traefik","docker","terraform","oracle","db","api","ui",
      "search","notifications","email","analytics","config","ci",
      "deps","dev","orders","inventory","shipping","products","store",
      "split-payments","migrations","rls","seed"
    ]],
    "scope-case": [2, "always", "lower-case"],
    "scope-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-case": [1, "always", "lower-case"],
    "subject-min-length": [2, "always", 10],
    "subject-max-length": [2, "always", 72],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "body-min-length": [2, "always", 20]
  },
  helpUrl: "https://github.com/OCI-BYOC/brandingos-platform/blob/main/.github/COMMIT_CONVENTION.md",
  ignores: [
    (commit) => commit.startsWith("Merge"),
    (commit) => commit.startsWith("Revert"),
    (commit) => commit.startsWith("fixup!"),
    (commit) => commit.startsWith("squash!")
  ]
};

export default config;
