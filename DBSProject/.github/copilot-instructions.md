# GitHub Copilot Implementation Instructions

Use these prompts sequentially to build the Roommate Matching System.

## 1. Database Schema & Setup
> **Prompt:** "Generate a SQL schema for a Roommate Matching System. 
> Tables needed: 
> - Students (id, name, age, course, year, hostel_block)
> - Preferences (id, student_id FK, sleep_time, study_habit, cleanliness, smoking, guest_freq)
> - Compatibility (id, student1_id FK, student2_id FK, score)
> - Rooms (id, room_number, capacity)
> - Room_Assignments (id, student_id FK, room_id FK)
> Ensure 3NF, add FK constraints, and create an index on Compatibility(score) for fast sorting."

## 2. Server Configuration
> **Prompt:** "Initialize a Node.js Express server with PostgreSQL/MySQL connection using the `pg` or `mysql2` library. Include dotenv for environment variables and CORS middleware."

## 3. The Matching Algorithm (The Core Logic)
> **Prompt:** "Write a JavaScript function `calculateCompatibility(p1, p2)` that calculates a score between 0 and 100.
> Logic:
> - Same sleep_time: +15
> - Same study_habit: +15
> - Same cleanliness: +10
> - Smoking conflict (one 'yes', one 'no'): -40
> - Guest frequency match: +10
> - Return the final score."

## 4. Matching Service (Batch Processing)
> **Prompt:** "Create a function `generateMatchesForStudent(studentId)`. It should:
> 1. Fetch preferences for the student.
> 2. Fetch preferences for all other students in the same hostel_block.
> 3. Loop through them, run `calculateCompatibility`, and update/insert results into the Compatibility table."

## 5. API Endpoints
> **Prompt:** "Create the following Express routes:
> - POST `/api/preferences`: Save student preferences and then trigger `generateMatchesForStudent`.
> - GET `/api/matches/:studentId`: Return the top 5 matches by joining Students and Compatibility tables.
> - GET `/api/admin/stats`: A query that shows the average compatibility score per hostel block."

## 6. Data Seeding
> **Prompt:** "Generate a SQL seed file with 20 dummy students and their corresponding preferences to test the matching algorithm."
