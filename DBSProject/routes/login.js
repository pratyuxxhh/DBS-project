const express = require('express');
const db = require('../config/dbConfig');

const router = express.Router();

// POST /api/login: Authenticate user
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Query to find user by email
    const query = 'SELECT id, name, email, age, course, year, gender, phone, address, city, state, created_at FROM users WHERE email = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // Check password (Note: In production, use bcrypt for password hashing)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Remove password from response for security
        delete user.password;

        // Return user data
        res.json({
            message: 'Login successful',
            user: user
        });
    });
});

module.exports = router;