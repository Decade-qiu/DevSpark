# DevSpark MVP

DevSpark is a feed-first workspace for turning RSS reading into draft content. This repository contains a Spring Boot backend and a Next.js frontend for the MVP scope.

## Requirements
- Java 21
- Node.js 18+ and npm

## Project Structure
- backend/ - Spring Boot API and background jobs
- frontend/ - Next.js app and UI tests

## Backend (Spring Boot)

Install and run tests:

```
cd backend
./gradlew test
```

Run the API server:

```
cd backend
./gradlew bootRun
```

The API will be available at http://localhost:8080.

## Frontend (Next.js)

Install dependencies and run unit tests:

```
cd frontend
npm install
npm test
```

Start the dev server:

```
cd frontend
npm run dev -- --hostname 127.0.0.1 --port 3000
```

The app will be available at http://127.0.0.1:3000.

## E2E Tests (Playwright)

Install browsers (one-time):

```
cd frontend
npx playwright install
```

Run E2E tests (requires the dev server running):

```
cd frontend
npm run test:e2e
```

## Current MVP Notes
- Auth, sources, feed, and drafts are currently stubbed or in-memory for TDD scaffolding.
- Database persistence and real RSS/summary pipelines will be wired in follow-up tasks.
