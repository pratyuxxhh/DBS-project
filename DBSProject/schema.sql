

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,   
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,   
    age INT,
    course VARCHAR(100),
    year INT,
    gender VARCHAR(20),   
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    user_id INT NOT NULL,
    
    hostel_block VARCHAR(50),
    sleep_time VARCHAR(50),
    study_habit VARCHAR(50),
    cleanliness VARCHAR(50),
    smoking VARCHAR(50),
    guest_freq VARCHAR(50),
    atheism VARCHAR(50),
    habits TEXT,
    vegetarian VARCHAR(50),
    introvert VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE compatibility (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    preference1_id INT NOT NULL,
    preference2_id INT NOT NULL,
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (preference1_id) REFERENCES preferences(id) ON DELETE CASCADE,
    FOREIGN KEY (preference2_id) REFERENCES preferences(id) ON DELETE CASCADE,
    CHECK (user1_id <> user2_id),
    UNIQUE KEY unique_pair (user1_id, user2_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    capacity INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE room_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    room_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE INDEX idx_compatibility_score ON compatibility(score);
CREATE INDEX idx_preferences_user_id ON preferences(user_id);