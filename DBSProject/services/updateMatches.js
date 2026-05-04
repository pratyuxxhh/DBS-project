const db = require('../config/dbConfig');
const { generateMatchesForStudent } = require('./matchingService');
const { calculateCompatibility } = require('../controllers/compatibility-algorithm');

const ROOM_SCORE_THRESHOLD = 50;

function queryAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function getStudentPreference(studentId) {
    const results = await queryAsync(
        'SELECT p.*, u.state FROM preferences p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?',
        [studentId]
    );
    return results[0] || null;
}

async function getCurrentAssignment(studentId) {
    const results = await queryAsync(
        `SELECT ra.room_id, r.room_number
         FROM room_assignments ra
         JOIN rooms r ON ra.room_id = r.id
         WHERE ra.student_id = ?`,
        [studentId]
    );
    return results[0] || null;
}

async function getRoomOccupants(roomId) {
    return queryAsync(
        `SELECT u.id AS student_id, u.name, p.*
         FROM room_assignments ra
         JOIN users u ON ra.student_id = u.id
         LEFT JOIN preferences p ON p.user_id = u.id
         WHERE ra.room_id = ?`,
        [roomId]
    );
}

async function getRoomsInBlock(block) {
    const blockName = block ? block.trim() : '';
    const blockLetter = blockName.split(' ').pop();

    return queryAsync(
        `SELECT r.id, r.room_number, r.capacity, COUNT(ra.student_id) AS occupied
         FROM rooms r
         LEFT JOIN room_assignments ra ON ra.room_id = r.id
         WHERE SUBSTRING_INDEX(r.room_number, '-', 1) = ?
         GROUP BY r.id
         ORDER BY r.room_number`,
        [blockLetter]
    );
}

function computeRoomScore(studentPref, occupants) {
    if (!occupants || occupants.length === 0) {
        return 100;
    }

    const scores = occupants.map((occupant) => calculateCompatibility(studentPref, occupant));
    return Math.min(...scores);
}

async function assignRoom(studentId, roomId) {
    await queryAsync(
        `INSERT INTO room_assignments (student_id, room_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE room_id = VALUES(room_id)`,
        [studentId, roomId]
    );
}

async function findBestSwapOrRoom(newStudentId, preference, debug = false) {
    const rooms = await getRoomsInBlock(preference.hostel_block);
    if (!rooms || rooms.length === 0) {
        return { type: 'none', message: 'No rooms in preferred block' };
    }

    if (debug) console.log(`[DEBUG] Checking ${rooms.length} rooms in ${preference.hostel_block}`);

    let bestSwapOption = null;
    let bestAvailableRoom = null;

    // First, check for beneficial swaps in occupied rooms
    for (const room of rooms) {
        if (Number(room.occupied) === room.capacity) {
            const occupants = await getRoomOccupants(room.id);
            if (debug) console.log(`[DEBUG] ${room.room_number}: Full (${room.occupied}/${room.capacity}), occupants: ${occupants.map(o => o.name).join(', ')}`);
            
            // Check each occupant for potential swap
            for (const occupant of occupants) {
                const compatWithNewStudent = calculateCompatibility(preference, occupant);
                
                // Calculate current compatibility of this occupant with their roommates
                const otherOccupants = occupants.filter(o => o.student_id !== occupant.student_id);
                const currentRoomScore = computeRoomScore(occupant, otherOccupants);
                
                if (debug) console.log(`[DEBUG]   ${occupant.name}: compat(new, occupant)=${compatWithNewStudent}, current_score=${currentRoomScore}`);
                
                // If new student is much more compatible, mark for swap
                if (compatWithNewStudent > currentRoomScore) {
                    if (!bestSwapOption || compatWithNewStudent > bestSwapOption.compatScore) {
                        if (debug) console.log(`[DEBUG]   -> SWAP CANDIDATE: ${occupant.name} (${compatWithNewStudent} > ${currentRoomScore})`);
                        bestSwapOption = {
                            type: 'swap',
                            room_id: room.id,
                            room_number: room.room_number,
                            displacedStudent: occupant,
                            compatScore: compatWithNewStudent,
                            oldScore: currentRoomScore
                        };
                    }
                }
            }
        }
    }

    // Also check available rooms
    const availableRooms = [];
    for (const room of rooms) {
        if (Number(room.occupied) < room.capacity) {
            const occupants = await getRoomOccupants(room.id);
            const score = computeRoomScore(preference, occupants);
            if (debug) console.log(`[DEBUG] ${room.room_number}: Available (${room.occupied}/${room.capacity}), occupants: ${occupants.map(o => o.name).join(', ') || 'EMPTY'}, score=${score}`);
            availableRooms.push({
                room_id: room.id,
                room_number: room.room_number,
                occupied: Number(room.occupied),
                capacity: room.capacity,
                score,
                occupants
            });
        }
    }

    if (availableRooms.length > 0) {
        const sortedRooms = availableRooms.sort((a, b) => {
            // Prefer rooms with existing occupants (compatible matches) over empty rooms
            const aEmpty = a.occupants.length === 0;
            const bEmpty = b.occupants.length === 0;
            
            if (aEmpty !== bEmpty) {
                return aEmpty ? 1 : -1; // Non-empty rooms come first
            }
            
            // If both empty or both occupied, sort by score
            if (b.score !== a.score) return b.score - a.score;
            return a.room_number.localeCompare(b.room_number);
        });
        bestAvailableRoom = sortedRooms[0];
        if (debug) console.log(`[DEBUG] Best available room: ${bestAvailableRoom.room_number} (occupants: ${bestAvailableRoom.occupants.length}) with score ${bestAvailableRoom.score}`);
    }

    // Compare swap vs available room
    if (bestSwapOption && bestAvailableRoom) {
        // Prefer swap if it's significantly better
        if (bestSwapOption.compatScore > bestAvailableRoom.score + 5) {
            if (debug) console.log(`[DEBUG] DECISION: SWAP (${bestSwapOption.compatScore} > ${bestAvailableRoom.score + 5})`);
            return bestSwapOption;
        }
        if (debug) console.log(`[DEBUG] DECISION: ASSIGN to available room ${bestAvailableRoom.room_number}`);
        return {
            type: 'assign',
            room_id: bestAvailableRoom.room_id,
            room_number: bestAvailableRoom.room_number,
            score: bestAvailableRoom.score,
            occupants: bestAvailableRoom.occupants
        };
    }

    if (bestSwapOption) {
        if (debug) console.log(`[DEBUG] DECISION: SWAP (only option)`);
        return bestSwapOption;
    }

    if (bestAvailableRoom) {
        if (debug) console.log(`[DEBUG] DECISION: ASSIGN to ${bestAvailableRoom.room_number}`);
        return {
            type: 'assign',
            room_id: bestAvailableRoom.room_id,
            room_number: bestAvailableRoom.room_number,
            score: bestAvailableRoom.score,
            occupants: bestAvailableRoom.occupants
        };
    }

    return { type: 'none', message: 'No suitable room or swap found' };
}

async function updateMatchesForStudent(studentId) {
    const normalizedStudentId = Number(studentId);
    if (!Number.isInteger(normalizedStudentId) || normalizedStudentId <= 0) {
        throw new Error('Invalid student ID');
    }

    const preference = await getStudentPreference(normalizedStudentId);
    if (!preference) {
        return { updated: false, message: 'No preferences found for student' };
    }

    console.log(`\n[UPDATE] Processing student ${normalizedStudentId}, preferences: ${preference.hostel_block}`);

    await generateMatchesForStudent(normalizedStudentId);

    // Remove current assignment
    await queryAsync('DELETE FROM room_assignments WHERE student_id = ?', [normalizedStudentId]);

    // Find best swap or available room
    const option = await findBestSwapOrRoom(normalizedStudentId, preference, true);

    if (option.type === 'none') {
        console.log(`[UPDATE] No option in preferred block, trying other blocks...`);
        // Try other blocks if preferred block has no options
        const allBlocks = ['Block A', 'Block B', 'Block C'];
        const preferredBlockLower = preference.hostel_block ? preference.hostel_block.toLowerCase() : '';
        
        for (const blockName of allBlocks) {
            if (blockName.toLowerCase() === preferredBlockLower) continue;
            
            const tempPreference = { ...preference, hostel_block: blockName };
            const blockOption = await findBestSwapOrRoom(normalizedStudentId, tempPreference, true);
            
            if (blockOption.type !== 'none') {
                await assignRoom(normalizedStudentId, blockOption.room_id);
                return {
                    updated: true,
                    message: `Your preferred block (${preference.hostel_block}) is full. You have been assigned to ${blockName}.`,
                    newRoom: blockOption.room_number,
                    newScore: blockOption.score,
                    assignedBlock: blockName
                };
            }
        }

        return { updated: false, message: 'No available rooms in any block. Please try again later.' };
    }

    if (option.type === 'swap') {
        // Perform swap: displace occupant and assign new student to room
        const displacedStudentId = option.displacedStudent.student_id;
        console.log(`[UPDATE] SWAP: Assigning student ${normalizedStudentId} to ${option.room_number}, displacing ${option.displacedStudent.name}`);
        
        await assignRoom(normalizedStudentId, option.room_id);

        // Recursively find room for displaced student
        const displacedPreference = await getStudentPreference(displacedStudentId);
        const displacedOption = await findBestSwapOrRoom(displacedStudentId, displacedPreference, true);

        if (displacedOption.type === 'none') {
            console.log(`[UPDATE] Finding alt block for displaced student ${displacedStudentId}`);
            // Try other blocks for displaced student
            const allBlocks = ['Block A', 'Block B', 'Block C'];
            const preferredBlockLower = displacedPreference.hostel_block ? displacedPreference.hostel_block.toLowerCase() : '';
            
            for (const blockName of allBlocks) {
                if (blockName.toLowerCase() === preferredBlockLower) continue;
                
                const tempPref = { ...displacedPreference, hostel_block: blockName };
                const blockOpt = await findBestSwapOrRoom(displacedStudentId, tempPref, true);
                
                if (blockOpt.type !== 'none') {
                    await assignRoom(displacedStudentId, blockOpt.room_id);
                    break;
                }
            }
        } else {
            if (displacedOption.type === 'swap') {
                // Recursive swap - handle displaced student's swap
                await assignRoom(displacedStudentId, displacedOption.room_id);
                // Continue chain if needed (simplified: just assign)
            } else {
                await assignRoom(displacedStudentId, displacedOption.room_id);
            }
        }

        return {
            updated: true,
            reason: 'Better match found; swapped with another student',
            newRoom: option.room_number,
            newScore: option.compatScore,
            displacedStudent: option.displacedStudent.name,
            displacedRoom: option.displacedStudent.room_number || 'TBD'
        };
    }

    // Regular assignment
    console.log(`[UPDATE] Regular assignment to ${option.room_number}`);
    await assignRoom(normalizedStudentId, option.room_id);
    return {
        updated: true,
        newRoom: option.room_number,
        newScore: option.score
    };
}

async function updateAllMatches() {
    const students = await queryAsync('SELECT id FROM users');
    const results = [];

    for (const student of students) {
        try {
            const result = await updateMatchesForStudent(student.id);
            results.push({ student_id: student.id, ...result });
        } catch (error) {
            results.push({ student_id: student.id, error: error.message });
        }
    }

    return results;
}

module.exports = { updateMatchesForStudent, updateAllMatches };