# DevSpark MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the MVP feed-first workflow for RSS ingestion, article summaries, drafting, and Markdown export with TDD.

**Architecture:** Next.js/React frontend; Spring Boot 3.4 backend with async jobs and Postgres. REST APIs, JWT auth, background fetch and summarize tasks, multi-tenant isolation.

**Tech Stack:** Java 21, Spring Boot 3.4, Spring Security, Spring AI, PostgreSQL, Testcontainers, Next.js, React, Vitest, Playwright.

---

## Task 1: Backend project skeleton and database wiring

**Files:**
- Create: `backend/build.gradle`, `backend/src/main/java/...`
- Create: `backend/src/test/java/...`

**Step 1: Write the failing test**

```java
@Test
void contextLoads() {}
```

**Step 2: Run test to verify it fails**

Run: `./gradlew test`
Expected: FAIL, missing Spring Boot app context.

**Step 3: Write minimal implementation**

```java
@SpringBootApplication
class DevSparkApplication { public static void main(String[] args){ SpringApplication.run(...);} }
```

**Step 4: Run test to verify it passes**

Run: `./gradlew test`
Expected: PASS

**Step 5: Commit**

```bash
git add backend
git commit -m "feat: bootstrap backend app"
```

---

## Task 2: Auth model and JWT security

**Files:**
- Create: `backend/src/main/java/.../auth/*`
- Create: `backend/src/test/java/.../auth/*`

**Step 1: Write the failing test**

```java
@Test
void registerCreatesUserAndReturnsToken() { /* MockMvc */ }
```

**Step 2: Run test to verify it fails**

Run: `./gradlew test --tests *AuthControllerTest`
Expected: FAIL, endpoint missing.

**Step 3: Write minimal implementation**

```java
@PostMapping("/auth/register")
public AuthResponse register(...) { /* create user, hash password, issue JWT */ }
```

**Step 4: Run test to verify it passes**

Run: `./gradlew test --tests *AuthControllerTest`
Expected: PASS

**Step 5: Commit**

```bash
git add backend
git commit -m "feat: add email auth and jwt"
```

---

## Task 3: Source model and OPML import

**Files:**
- Create: `backend/src/main/java/.../sources/*`
- Test: `backend/src/test/java/.../sources/*`

**Step 1: Write the failing test**

```java
@Test
void importOpmlCreatesSources() { /* upload OPML */ }
```

**Step 2: Run test to verify it fails**

Run: `./gradlew test --tests *OpmlImportTest`
Expected: FAIL

**Step 3: Write minimal implementation**

```java
@PostMapping("/sources/import-opml")
public ImportResult importOpml(MultipartFile file) { /* parse and persist */ }
```

**Step 4: Run test to verify it passes**

Run: `./gradlew test --tests *OpmlImportTest`
Expected: PASS

**Step 5: Commit**

```bash
git add backend
git commit -m "feat: add sources and opml import"
```

---

## Task 4: RSS fetcher and article ingestion

**Files:**
- Create: `backend/src/main/java/.../ingestion/*`
- Test: `backend/src/test/java/.../ingestion/*`

**Step 1: Write the failing test**

```java
@Test
void fetcherStoresNewArticlesAndDedupeByUrl() {}
```

**Step 2: Run test to verify it fails**

Run: `./gradlew test --tests *RssFetcherTest`
Expected: FAIL

**Step 3: Write minimal implementation**

```java
public void fetch(Source source) { /* HTTP, parse, dedupe */ }
```

**Step 4: Run test to verify it passes**

Run: `./gradlew test --tests *RssFetcherTest`
Expected: PASS

**Step 5: Commit**

```bash
git add backend
git commit -m "feat: add rss ingestion"
```

---

## Task 5: Summary job and status flow

**Files:**
- Create: `backend/src/main/java/.../summary/*`
- Test: `backend/src/test/java/.../summary/*`

**Step 1: Write the failing test**

```java
@Test
void summaryJobUpdatesStatusAndText() {}
```

**Step 2: Run test to verify it fails**

Run: `./gradlew test --tests *SummaryJobTest`
Expected: FAIL

**Step 3: Write minimal implementation**

```java
public void summarize(Article article) { /* call stub provider, update status */ }
```

**Step 4: Run test to verify it passes**

Run: `./gradlew test --tests *SummaryJobTest`
Expected: PASS

**Step 5: Commit**

```bash
git add backend
git commit -m "feat: add article summary job"
```

---

## Task 6: Feed and article APIs

**Files:**
- Create: `backend/src/main/java/.../feed/*`
- Test: `backend/src/test/java/.../feed/*`

**Step 1: Write the failing test**

```java
@Test
void listArticlesFiltersByUserAndSource() {}
```

**Step 2: Run test to verify it fails**

Run: `./gradlew test --tests *FeedApiTest`
Expected: FAIL

**Step 3: Write minimal implementation**

```java
@GetMapping("/articles")
public Page<ArticleDto> list(...) {}
```

**Step 4: Run test to verify it passes**

Run: `./gradlew test --tests *FeedApiTest`
Expected: PASS

**Step 5: Commit**

```bash
git add backend
git commit -m "feat: add feed and article apis"
```

---

## Task 7: Drafts and export

**Files:**
- Create: `backend/src/main/java/.../drafts/*`
- Test: `backend/src/test/java/.../drafts/*`

**Step 1: Write the failing test**

```java
@Test
void exportReturnsMarkdownWithCitations() {}
```

**Step 2: Run test to verify it fails**

Run: `./gradlew test --tests *DraftExportTest`
Expected: FAIL

**Step 3: Write minimal implementation**

```java
public ExportResponse export(UUID draftId) { /* render markdown */ }
```

**Step 4: Run test to verify it passes**

Run: `./gradlew test --tests *DraftExportTest`
Expected: PASS

**Step 5: Commit**

```bash
git add backend
git commit -m "feat: add drafts and markdown export"
```

---

## Task 8: Frontend app shell and auth

**Files:**
- Create: `frontend/app/*`, `frontend/components/*`
- Test: `frontend/src/__tests__/*`

**Step 1: Write the failing test**

```tsx
it("renders login form", () => { /* RTL */ })
```

**Step 2: Run test to verify it fails**

Run: `pnpm test` (or `npm test`)
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
export default function LoginPage() { return <form>...</form>; }
```

**Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS

**Step 5: Commit**

```bash
git add frontend
git commit -m "feat: add auth pages"
```

---

## Task 9: Feed page and card components

**Files:**
- Create: `frontend/src/features/feed/*`
- Test: `frontend/src/features/feed/__tests__/*`

**Step 1: Write the failing test**

```tsx
it("renders summary and open action", () => {})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
function FeedCard({ article }) { return (...) }
```

**Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS

**Step 5: Commit**

```bash
git add frontend
git commit -m "feat: add feed page"
```

---

## Task 10: Read/Write split editor

**Files:**
- Create: `frontend/src/features/reader/*`
- Test: `frontend/src/features/reader/__tests__/*`

**Step 1: Write the failing test**

```tsx
it("inserts citation into editor", () => {})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
function ReaderEditor() { /* split layout */ }
```

**Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS

**Step 5: Commit**

```bash
git add frontend
git commit -m "feat: add split reader editor"
```

---

## Task 11: Draft list and export

**Files:**
- Create: `frontend/src/features/drafts/*`
- Test: `frontend/src/features/drafts/__tests__/*`

**Step 1: Write the failing test**

```tsx
it("shows export action", () => {})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
function DraftList() { return (...) }
```

**Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS

**Step 5: Commit**

```bash
git add frontend
git commit -m "feat: add drafts list and export"
```

---

## Task 12: E2E flow test

**Files:**
- Create: `frontend/tests/e2e/mvp.spec.ts`

**Step 1: Write the failing test**

```ts
test("user can go from feed to export", async () => {})
```

**Step 2: Run test to verify it fails**

Run: `pnpm playwright test`
Expected: FAIL

**Step 3: Write minimal implementation**

```ts
// no code changes; use test as acceptance gate
```

**Step 4: Run test to verify it passes**

Run: `pnpm playwright test`
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/tests/e2e/mvp.spec.ts
git commit -m "test: add mvp e2e flow"
```
