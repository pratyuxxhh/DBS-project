const express = require('express');
const db = require('../config/dbConfig');

const router = express.Router();

// POST /api/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Query to find user by email and password
    const query = 'SELECT id, name, email, age, course, year, gender, phone, address, city, state, created_at FROM users WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if user exists and password matches
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // Return user data
        res.json({
            message: 'Login successful',
            user: user
        });
    });
});

module.exports = router;