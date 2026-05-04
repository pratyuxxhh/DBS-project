const express = require('express');
const db = require('../config/dbConfig');
const { generateMatchesForStudent } = require('../services/matchingService');
const { updateMatchesForStudent, updateAllMatches } = require('../services/updateMatches');

const router = express.Router();

// POST /api/preferences: Save student preferences and trigger generateMatchesForStudent
router.post('/preferences', async (req, res) => {
    const { 
        user_id, 
        hostel_block,
        sleep_time, 
        study_habit, 
        cleanliness, 
        smoking, 
        guest_freq,
        atheism,
        habits,
        vegetarian,
        introvert
    } = req.body;
    const parsedUserId = Number(user_id);

    if (
        !Number.isInteger(parsedUserId) ||
        parsedUserId <= 0 ||
        !sleep_time ||
        !study_habit ||
        !cleanliness ||
        !smoking ||
        !guest_freq
    ) {
        return res.status(400).json({ error: 'Invalid or missing preference fields' });
    }

    const insertQuery = `
        INSERT INTO preferences (user_id, hostel_block, sleep_time, study_habit, cleanliness, smoking, guest_freq, atheism, habits, vegetarian, introvert)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        hostel_block = VALUES(hostel_block),
        sleep_time = VALUES(sleep_time),
        study_habit = VALUES(study_habit),
        cleanliness = VALUES(cleanliness),
        smoking = VALUES(smoking),
        guest_freq = VALUES(guest_freq),
        atheism = VALUES(atheism),
        habits = VALUES(habits),
        vegetarian = VALUES(vegetarian),
        introvert = VALUES(introvert)
    `;

    db.query(insertQuery, [parsedUserId, hostel_block, sleep_time, study_habit, cleanliness, smoking, guest_freq, atheism, habits, vegetarian, introvert], async (err) => {
        if (err) {
            console.error('Error saving preferences:', err);
            return res.status(500).json({ error: 'Failed to save preferences' });
        }

        try {
            const result = await generateMatchesForStudent(parsedUserId);
            res.json({
                message: 'Preferences saved and match generation completed',
                match_generation: result
            });
        } catch (matchErr) {
            console.error('Error generating matches:', matchErr);
            res.status(500).json({ error: 'Preferences saved, but match generation failed' });
        }
    });
});

// GET /api/preferences/:userId: Get preferences for a specific user
router.get('/preferences/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT * FROM preferences WHERE user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching preferences:', err);
            return res.status(500).json({ error: 'Failed to fetch preferences' });
        }
        
        if (results.length === 0) {
            return res.json({ preferences: null });
        }
        
        res.json({ preferences: results[0] });
    });
});

// GET /api/matches/:studentId: Return top 5 matches
router.get('/matches/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    const query = `
        SELECT u.name, c.score
        FROM compatibility c
        JOIN users u ON c.user2_id = u.id
        WHERE c.user1_id = ?
        ORDER BY c.score DESC
        LIMIT 5
    `;

    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching matches:', err);
            return res.status(500).json({ error: 'Failed to fetch matches' });
        }
        res.json(results);
    });
});

// POST /api/update-matches/:studentId: Recalculate and reassign a student if needed
router.post('/update-matches/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    try {
        const result = await updateMatchesForStudent(studentId);
        res.json(result);
    } catch (err) {
        console.error('Error updating matches:', err);
        res.status(500).json({ error: 'Failed to update matches' });
    }
});

// POST /api/update-matches: Recalculate and reassign matches for all students
router.post('/update-matches', async (req, res) => {
    try {
        const result = await updateAllMatches();
        res.json(result);
    } catch (err) {
        console.error('Error updating all matches:', err);
        res.status(500).json({ error: 'Failed to update all matches' });
    }
});

// GET /api/admin/stats: Average compatibility score per hostel block
router.get('/admin/stats', (req, res) => {
    const query = `
        SELECT p.hostel_block, AVG(c.score) as avg_score
        FROM compatibility c
        JOIN preferences p ON c.user1_id = p.user_id
        GROUP BY p.hostel_block
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching stats:', err);
            return res.status(500).json({ error: 'Failed to fetch stats' });
        }
        res.json(results);
    });
});

// GET /api/allotments: Get all room allotments with occupants
router.get('/allotments', (req, res) => {
    const query = `
        SELECT r.room_number,
               CONCAT('Block ', SUBSTRING_INDEX(r.room_number, '-', 1)) AS block,
               u.name
        FROM rooms r
        LEFT JOIN room_assignments ra ON ra.room_id = r.id
        LEFT JOIN users u ON ra.student_id = u.id
        ORDER BY block, r.room_number
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching allotments:', err);
            return res.status(500).json({ error: 'Failed to fetch allotments' });
        }

        // Group by room_number and block
        const allotments = {};
        results.forEach(row => {
            const key = `${row.block}-${row.room_number}`;
            if (!allotments[key]) {
                allotments[key] = {
                    block: row.block,
                    room_number: row.room_number,
                    occupants: []
                };
            }
            if (row.name) {
                allotments[key].occupants.push(row.name);
            }
        });

        // Convert to array and sort
        const allotmentArray = Object.values(allotments).sort((a, b) => {
            const blockCompare = a.block.localeCompare(b.block);
            if (blockCompare !== 0) return blockCompare;
            return a.room_number.localeCompare(b.room_number);
        });

        // Sort occupants in each room
        allotmentArray.forEach(room => {
            room.occupants.sort();
        });

        res.json(allotmentArray);
    });
});

module.exports = router;