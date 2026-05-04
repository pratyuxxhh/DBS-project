This is a solid PRD. Since you are targeting a backend-heavy execution with a focus on DBMS marks, the key is to ensure your database does the heavy lifting.

Below is your **PLAN.md** structured for a Node.js/Express server and a **Copilot Checklist** to help you generate the code efficiently.

---

## 📄 PLAN.md: Execution Roadmap

### Phase 1: Environment & DB Setup (Day 1)
*   **Initialize Node.js:** Setup `express`, `dotenv`, `pg` (PostgreSQL) or `mysql2`, and `cors`.
*   **Database Provisioning:** Create the schema in your local DB instance.
*   **Seeding Data:** Create a `seed.sql` file with 20-30 dummy students to demonstrate the matching logic immediately.

### Phase 2: Core API Development (Day 2)
*   **Schema Implementation:** Define Sequelize/TypeORM models or raw SQL migrations.
*   **Preference API:** Endpoint to POST student preferences.
*   **The Matching Engine:** A dedicated service layer to calculate compatibility scores and upsert them into the `Compatibility` table.

### Phase 3: Advanced DBMS Features (Day 3)
*   **Complexity:** Implement the "Advanced DBMS" requirements (Normalization check, Indexing, and Joins).
*   **Stored Procedures/Views (Optional Bonus):** Create a Database View for `v_top_matches` to show off SQL skills.

### Phase 4: Frontend & Presentation (Day 4)
*   **Simple UI:** A dashboard to view "My Top Matches."
*   **Admin View:** A table showing all students and their assigned rooms.

---

## ✅ Copilot Checklist: Functional Requirements

Use these prompts one by one with **GitHub Copilot** to generate the implementation.

### 1. Database & Models
- [ ] "Generate a SQL schema for a Roommate Matching System with Tables: Students, Preferences, Compatibility, Rooms, and Room_Assignments. Ensure 3NF and include Foreign Key constraints."
- [ ] "Create an Index on `Compatibility(score)` and `Preference(student_id)` for optimized retrieval."
- [ ] "Write a Node.js script using `pg` or `mysql2` to connect to this database."



### 2. The Matching Logic (Service Layer)
- [ ] "Write a JavaScript function `calculateCompatibility(studentA, studentB)` that takes two preference objects and returns a score based on:
    - Same `sleep_time`: +15
    - Same `cleanliness`: +15
    - `smoking` conflict (one yes, one no): -30
    - Same `study_habit`: +10
    - Return an integer between 0 and 100."
- [ ] "Create a function `refreshMatches(studentId)` that compares a specific student against all others in the `Preferences` table and updates the `Compatibility` table."

### 3. API Endpoints
- [ ] "Create an Express POST route `/api/preferences` to save user habits and trigger the matching calculation."
- [ ] "Create an Express GET route `/api/matches/:studentId` that joins `Student` and `Compatibility` tables to return the top 5 matches with names and scores."
- [ ] "Create an Express GET route `/api/admin/unassigned` to find students who haven't been assigned a room using a `LEFT JOIN`."

### 4. Logic & Edge Cases
- [ ] "Add a constraint to the matching logic to ensure students are only matched with others in the same `hostel_block`."
- [ ] "Implement a 'Mutual Match' query: find pairs where both students appear in each other's top 5 matches."

---

## 💡 DBMS "Pro-Tips" for your Viva

To ensure you hit that **"Advanced DBMS Concepts"** mark, be ready to explain these specific choices to your examiner:

*   **Normalization:** Explain why `Preferences` is a separate table. *Answer: To avoid multi-valued attributes in the Student table and allow for easier scaling if you add more preference types later.*
*   **Indexing:** Explain why you indexed the `score` column. *Answer: The matching algorithm requires frequent `ORDER BY score DESC` queries; an index turns an $O(N \log N)$ sort into a much faster range scan.*
*   **Set-Based vs Row-Based:** If asked, explain that calculating all matches at once is a "Cross Join" (Cartesian Product) which you then filter down, showing you understand relational algebra.

### Suggested SQL for "The Money Shot" (Complex Join)
Show this specific query in your documentation to prove you aren't just doing basic CRUD:

```sql
-- Find top 3 matches for Student X, including their shared habits
SELECT 
    s.name, 
    c.score, 
    p.sleep_time, 
    p.cleanliness
FROM Compatibility c
JOIN Student s ON c.student2_id = s.student_id
JOIN Preference p ON s.student_id = p.student_id
WHERE c.student1_id = [STUDENT_ID]
ORDER BY c.score DESC
LIMIT 3;
```