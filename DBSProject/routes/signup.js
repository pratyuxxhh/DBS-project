const express = require('express');
const db = require('../config/dbConfig');
const { generateMatchesForStudent } = require('../services/matchingService');

const router = express.Router();

// POST /api/signup
// Stores user data only. Preferences can be set later on dashboard.
router.post('/signup', (req, res) => {
    const userData = req.body;
    if (!userData) {
        return res.status(400).json({ error: 'Request must include userData' });
    }

    const {
        name,
        email,
        password,
        age,
        course,
        year,
        gender,
        phone,
        address,
        city,
        state
    } = userData;

    const parsedAge = Number(age);
    const parsedYear = Number(year);

    if (
        !name ||
        !email ||
        !password ||
        !course ||
        !gender ||
        !Number.isInteger(parsedAge) ||
        parsedAge <= 0 ||
        !Number.isInteger(parsedYear) ||
        parsedYear <= 0
    ) {
        return res.status(400).json({ error: 'Please fill all required fields correctly' });
    }

    const insertStudentQuery = `
        INSERT INTO users (name, email, password, age, course, year, gender, phone, address, city, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        insertStudentQuery,
        [name, email, password, parsedAge, course, parsedYear, gender, phone || null, address || null, city || null, state || null],
        (studentErr, studentResult) => {
            if (studentErr) {
                if (studentErr.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Email is already registered' });
                }
                console.error('Error creating student:', studentErr);
                return res.status(500).json({ error: 'Failed to create student account' });
            }

            const studentId = studentResult.insertId;
            return res.status(201).json({
                message: 'Signup successful',
                user: { id: studentId, name }
            });
        }
    );
});

// GET /api/preferences/:userId
// Retrieve preferences for a user
router.get('/preferences/:userId', (req, res) => {
    const userId = req.params.userId;
    
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const query = 'SELECT * FROM preferences WHERE user_id = ?';
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching preferences:', err);
            return res.status(500).json({ error: 'Failed to fetch preferences' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Preferences not found' });
        }

        res.json({ preferences: results[0] });
    });
});

// POST /api/preferences
// Create or update user preferences
router.post('/preferences', (req, res) => {
    const {
        user_id,
        hostel_block,
        sleep_time,
        study_habit,
        cleanliness,
        smoking,
        guest_freq,
        atheism,
        habits
    } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!sleep_time || !study_habit || !cleanliness || !smoking || !guest_freq) {
        return res.status(400).json({ error: 'All required preference fields must be filled' });
    }

    // Check if preferences already exist
    const checkQuery = 'SELECT id FROM preferences WHERE user_id = ?';
    
    db.query(checkQuery, [user_id], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error checking preferences:', checkErr);
            return res.status(500).json({ error: 'Failed to process preferences' });
        }

        if (checkResults.length > 0) {
            // Update existing preferences
            const updateQuery = `
                UPDATE preferences 
                SET hostel_block = ?, sleep_time = ?, study_habit = ?, 
                    cleanliness = ?, smoking = ?, guest_freq = ?, atheism = ?, habits = ?
                WHERE user_id = ?
            `;

            db.query(
                updateQuery,
                [hostel_block || null, sleep_time, study_habit, cleanliness, smoking, guest_freq, atheism || null, habits || null, user_id],
                (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating preferences:', updateErr);
                        return res.status(500).json({ error: 'Failed to update preferences' });
                    }

                    // Regenerate matches
                    generateMatchesForStudent(user_id).catch((matchErr) => {
                        console.error('Error regenerating matches:', matchErr);
                    });

                    res.json({ message: 'Preferences updated successfully!' });
                }
            );
        } else {
            // Create new preferences
            const insertQuery = `
                INSERT INTO preferences (user_id, hostel_block, sleep_time, study_habit, cleanliness, smoking, guest_freq, atheism, habits)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [user_id, hostel_block || null, sleep_time, study_habit, cleanliness, smoking, guest_freq, atheism || null, habits || null],
                (insertErr) => {
                    if (insertErr) {
                        console.error('Error creating preferences:', insertErr);
                        return res.status(500).json({ error: 'Failed to save preferences' });
                    }

                    // Generate matches for the student
                    generateMatchesForStudent(user_id).catch((matchErr) => {
                        console.error('Error generating matches:', matchErr);
                    });

                    res.json({ message: 'Preferences saved successfully!' });
                }
            );
        }
    });
});

module.exports = router;