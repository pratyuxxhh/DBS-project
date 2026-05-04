const db = require('../config/dbConfig');
const { calculateCompatibility } = require('../controllers/compatibility-algorithm');

function generateMatchesForStudent(studentId) {
    return new Promise((resolve, reject) => {
        const normalizedStudentId = Number(studentId);
        if (!Number.isInteger(normalizedStudentId) || normalizedStudentId <= 0) {
            return reject(new Error('Invalid student ID'));
        }

        // Fetch preferences for the student
        const getStudentPrefsQuery = 'SELECT p.*, u.state FROM preferences p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?';
        db.query(getStudentPrefsQuery, [normalizedStudentId], (err, studentPrefs) => {
            if (err) {
                return reject(err);
            }
            if (studentPrefs.length === 0) {
                return resolve({ generated: 0, reason: 'No preferences found for student' });
            }
            const p1 = studentPrefs[0];

            // Fetch preferences for all other students in the same hostel_block
            const getOtherPrefsQuery = `
                SELECT p.*, p.id as preference_id, u.state FROM preferences p
                JOIN users u ON p.user_id = u.id
                WHERE p.hostel_block = ? AND p.user_id != ?
            `;
            db.query(getOtherPrefsQuery, [p1.hostel_block, normalizedStudentId], (otherErr, otherPrefs) => {
                if (otherErr) {
                    return reject(otherErr);
                }

                if (!otherPrefs || otherPrefs.length === 0) {
                    return resolve({ generated: 0, reason: 'No other preferences found in hostel block' });
                }

                let completed = 0;
                let failed = false;
                const insertQuery = `
                    INSERT INTO compatibility (user1_id, user2_id, preference1_id, preference2_id, score)
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE score = VALUES(score)
                `;

                otherPrefs.forEach((p2) => {
                    const score = calculateCompatibility(p1, p2);
                    db.query(insertQuery, [normalizedStudentId, p2.user_id, p1.id, p2.preference_id, score], (insertErr) => {
                        if (failed) {
                            return;
                        }
                        if (insertErr) {
                            failed = true;
                            return reject(insertErr);
                        }

                        completed += 1;
                        if (completed === otherPrefs.length) {
                            resolve({ generated: completed });
                        }
                    });
                });
            });
        });
    });
}

module.exports = { generateMatchesForStudent };