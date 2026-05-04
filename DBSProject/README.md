# Roommate Matching System

A Node.js application for matching roommates based on preferences.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up MySQL database:
   - Create a database named `roommate_matching`
   - Run the schema.sql to create tables
   - Run seed.sql to insert dummy data

3. Configure environment variables in .env (already done)

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

- POST /api/login: User login
- POST /api/preferences: Save preferences and generate matches
- GET /api/matches/:studentId: Get top 5 matches
- GET /api/admin/stats: Get average compatibility per hostel block

## Frontend Pages

- landing-page.html: Welcome page
- login.html: User login
- dashboard.html: Enter preferences
- score.html: View compatibility scores
- final-allotment.html: View assigned roommate

## Files Structure

- schema.sql: Database schema
- seed.sql: Dummy data
- server.js: Main server file
- config/dbConfig.js: Database configuration
- controllers/compatibility-algorithm.js: Matching algorithm
- services/matchingService.js: Batch matching service
- routes/compatibilityRoutes.js: API routes
- routes/authentication.js: Authentication routes
- public/: Frontend HTML files