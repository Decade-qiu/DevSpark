# DevSpark MVP Spec (2026-02-10)

## 1. Scope
MVP focuses on a feed-first workflow that turns a single RSS article into a draft in under 10 minutes. The system supports multi-tenant SaaS with email+password auth, RSS subscriptions, OPML import, per-article AI summaries, two writing templates (tweet and blog outline), and Markdown export.

## 2. Goals and Success Criteria
- Primary goal: TTFD (Time to First Draft) under 10 minutes.
- Secondary goals: steady weekly drafts, improved signal-to-noise, stable ingestion.

Success criteria:
- OPML import success rate > 95%.
- New articles visible in feed within 10 minutes.
- Summary failures do not block writing.
- Exported Markdown includes citation links.
- Cross-user isolation with zero data leakage.

## 3. Non-Goals (Explicitly Out of Scope)
- Topic spaces and knowledge graphing.
- Clustering, evidence packs, or multi-article synthesis.
- Multi-channel formatting (WeChat/X/Notion, etc.).
- Collaboration, team workspaces, or comments.
- Full-text search beyond title/summary keyword query.

## 4. Personas and User Journeys
Primary persona: Chinese developer-content creator who wants to turn daily reading into publishable drafts.

Core journey:
1) Sign up and import OPML or add RSS manually.
2) Open feed, skim AI summaries.
3) Open an article and enter split read/write view.
4) Generate draft template, insert 1-2 citations.
5) Export Markdown.

## 5. Functional Requirements

### 5.1 Authentication
- Email + password registration and login.
- JWT-based session; user profile endpoint.
- Passwords stored with secure hashing (bcrypt/argon2id).

### 5.2 Sources (RSS)
- Add a single RSS feed by URL.
- Import OPML (multiple feeds).
- List and delete sources.
- Store ETag/Last-Modified for incremental fetch.

### 5.3 Ingestion and Deduplication
- Scheduled fetch every 10 minutes per user.
- Parse RSS/Atom entries into normalized article records.
- Deduplicate by URL (primary) and fallback hash (title + published date).
- Store raw HTML and extracted text.

### 5.4 AI Summarization
- Per-article summary only (no clustering).
- Async job triggered after new article is stored.
- Summary status: PENDING, RUNNING, SUCCEEDED, FAILED.
- Failures surface as UI tag; allow manual writing.

### 5.5 Feed and Article View
- Feed API supports pagination and optional source filter and keyword query.
- Article detail returns full content, summary, and metadata.

### 5.6 Drafts and Templates
- Create a draft from an article with template type:
  - Tweet
  - Blog outline
- Save draft edits.
- Insert citation blocks from article content (quote + source link).
- Draft status: DRAFT, EXPORTED.

### 5.7 Export
- Export draft to Markdown, returned as downloadable content.

## 6. Data Model (PostgreSQL)
All tables include `id (uuid)`, `created_at`, `updated_at` unless noted.

### users
- email (unique, required)
- password_hash (required)
- status (ACTIVE, DISABLED)

### sources
- user_id (FK users)
- title
- feed_url (required)
- site_url
- etag
- last_modified
- last_fetch_at
- status (ACTIVE, PAUSED, ERROR)
- Unique: (user_id, feed_url)

### articles
- user_id (FK users)
- source_id (FK sources)
- title (required)
- url (required)
- author
- published_at
- content_html
- content_text
- summary_text
- summary_status
- summary_updated_at
- dedupe_hash
- fetched_at
- Unique: (user_id, url)
- Indexes: (user_id, published_at DESC), (user_id, source_id)

### drafts
- user_id (FK users)
- article_id (FK articles)
- template_type (TWEET, BLOG_OUTLINE)
- title
- body_md
- status (DRAFT, EXPORTED)
- exported_at

### draft_citations
- draft_id (FK drafts)
- article_id (FK articles)
- quote
- context
- url

### job_runs
- job_type (FETCH_RSS, SUMMARIZE_ARTICLE)
- status (RUNNING, SUCCEEDED, FAILED)
- error
- duration_ms

## 7. API Design (REST)
Base: `/api`

### Auth
- POST `/auth/register`
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- POST `/auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- GET `/auth/me`
  - Response: `{ id, email }`

### Sources
- GET `/sources?page=&size=`
- POST `/sources`
  - Body: `{ feedUrl }`
- POST `/sources/import-opml`
  - Multipart file upload
- DELETE `/sources/:id`

### Articles
- GET `/articles?sourceId=&q=&page=&size=`
- GET `/articles/:id`

### Drafts
- POST `/drafts`
  - Body: `{ articleId, templateType }`
- PUT `/drafts/:id`
  - Body: `{ title, bodyMd }`
- POST `/drafts/:id/citations`
  - Body: `{ quote, context, url }`
- POST `/drafts/:id/export`
  - Response: `{ fileName, contentMd }`

### Error format
`{ code: string, message: string, details?: object }`

## 8. Background Jobs
- `fetch-rss`: runs every 10 minutes, respects ETag/Last-Modified.
- `summarize-article`: triggered per new article, uses Spring AI provider.
- Job results persisted to `job_runs`.

## 9. Security and Multi-Tenancy
- All queries filter by `user_id` from JWT.
- Deny cross-tenant access with 403.
- Rate limit login and import endpoints.

## 10. Frontend Design (UI/UX)
Style system from ui-ux-pro-max:
- Style: Glassmorphism with editorial workspace feel.
- Colors: background #FAFAFA, text #09090B, accent #EC4899, secondary #3F3F46.
- Typography: Space Grotesk (heading), DM Sans (body).
- Effects: subtle blur, 1px translucent borders, light shadows.

Pages:
1) Auth: split hero + card auth form.
2) Feed: floating nav (search, import, add RSS, profile). Left feed cards, right summary preview and quick draft CTA.
3) Read/Write: split reader/editor. Citation insert button per paragraph.
4) Drafts: list drafts with status, edit, export.

Responsive:
- Mobile uses tab switcher for Read/Write.
- Minimum 16px body text; 44px touch targets; visible focus rings.

React structure (suggested):
- `frontend/src/app` (Next.js App Router)
- `frontend/src/components` (Card, Button, Navbar, Skeleton, Editor)
- `frontend/src/features/feed`, `frontend/src/features/drafts`, `frontend/src/features/reader`

## 11. Testing (TDD)
- All feature work follows TDD: write failing test, run, implement, run.
- Backend: JUnit + MockMvc + Testcontainers (Postgres). Unit tests for RSS parsing, dedupe, Markdown export. Integration tests for API + auth + multi-tenancy.
- Frontend: Vitest + React Testing Library for components; Playwright for E2E core flow.

## 12. Acceptance Checklist
- Auth, RSS, OPML, feed, drafts, export all working.
- Summary failures do not block drafting.
- Exported Markdown contains citations with source links.
- TTFD < 10 minutes for a new user in testing.
