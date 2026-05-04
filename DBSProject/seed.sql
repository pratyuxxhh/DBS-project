
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE room_assignments;
TRUNCATE TABLE compatibility;
TRUNCATE TABLE preferences;
TRUNCATE TABLE rooms;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (name, email, password, age, course, year, gender, phone, address, city, state) VALUES
('Aarav Sharma', 'aarav@example.com', 'pass123', 20, 'Computer Science', 2, 'Male', '9000000001', '12 MG Road', 'Bangalore', 'KA'),
('Vihaan Gupta', 'vihaan@example.com', 'pass123', 21, 'Engineering', 3, 'Male', '9000000002', '14 MG Road', 'Bangalore', 'KA'),
('Ananya Singh', 'ananya@example.com', 'pass123', 19, 'Mathematics', 1, 'Female', '9000000003', '16 MG Road', 'Delhi', 'DL'),
('Ishaan Verma', 'ishaan@example.com', 'pass123', 22, 'Physics', 4, 'Male', '9000000004', '18 MG Road', 'Delhi', 'DL'),
('Diya Patel', 'diya@example.com', 'pass123', 20, 'Chemistry', 2, 'Female', '9000000005', '20 Ring Road', 'Ahmedabad', 'GJ'),
('Rohan Mehta', 'rohan@example.com', 'pass123', 21, 'Biology', 3, 'Male', '9000000006', '22 Ring Road', 'Ahmedabad', 'GJ'),
('Meera Nair', 'meera@example.com', 'pass123', 19, 'History', 1, 'Female', '9000000007', '24 Marine Drive', 'Mumbai', 'MH'),
('Arjun Reddy', 'arjun@example.com', 'pass123', 22, 'Economics', 4, 'Male', '9000000008', '26 Marine Drive', 'Mumbai', 'MH'),
('Sneha Iyer', 'sneha@example.com', 'pass123', 20, 'Psychology', 2, 'Female', '9000000009', '30 Brigade Road', 'Bangalore', 'KA'),
('Karthik Rao', 'karthik@example.com', 'pass123', 21, 'Sociology', 3, 'Male', '9000000010', '32 Brigade Road', 'Bangalore', 'KA'),

('Pooja Kulkarni', 'pooja@example.com', 'pass123', 19, 'Literature', 1, 'Female', '9000000011', '34 FC Road', 'Pune', 'MH'),
('Aditya Joshi', 'aditya@example.com', 'pass123', 22, 'Philosophy', 4, 'Male', '9000000012', '36 FC Road', 'Pune', 'MH'),
('Neha Chatterjee', 'neha@example.com', 'pass123', 20, 'Art', 2, 'Female', '9000000013', '40 Park Street', 'Kolkata', 'WB'),
('Rahul Das', 'rahul@example.com', 'pass123', 21, 'Music', 3, 'Male', '9000000014', '42 Park Street', 'Kolkata', 'WB'),
('Simran Kaur', 'simran@example.com', 'pass123', 19, 'Theater', 1, 'Female', '9000000015', '44 Sector 17', 'Chandigarh', 'CH'),
('Gurpreet Singh', 'gurpreet@example.com', 'pass123', 22, 'Film', 4, 'Male', '9000000016', '46 Sector 17', 'Chandigarh', 'CH'),
('Nikhil Bansal', 'nikhil@example.com', 'pass123', 20, 'Design', 2, 'Male', '9000000017', '50 Rajpath', 'Jaipur', 'RJ'),
('Aditi Agarwal', 'aditi@example.com', 'pass123', 21, 'Architecture', 3, 'Female', '9000000018', '52 Rajpath', 'Jaipur', 'RJ'),
('Tanvi Mishra', 'tanvi@example.com', 'pass123', 19, 'Law', 1, 'Female', '9000000019', '54 Hazratganj', 'Lucknow', 'UP'),
('Yash Tripathi', 'yash@example.com', 'pass123', 22, 'Business', 4, 'Male', '9000000020', '56 Hazratganj', 'Lucknow', 'UP'),

('Harsh Vardhan', 'harsh@example.com', 'pass123', 20, 'Computer Science', 2, 'Male', '9000000021', '12 Boring Road', 'Patna', 'BR'),
('Kavya Ramesh', 'kavya@example.com', 'pass123', 21, 'Engineering', 3, 'Female', '9000000022', '14 Anna Nagar', 'Chennai', 'TN'),
('Manish Yadav', 'manish@example.com', 'pass123', 19, 'Mathematics', 1, 'Male', '9000000023', '16 Gomti Nagar', 'Lucknow', 'UP'),
('Priya Shetty', 'priya@example.com', 'pass123', 22, 'Physics', 4, 'Female', '9000000024', '18 Jayanagar', 'Bangalore', 'KA'),
('Siddharth Jain', 'sid@example.com', 'pass123', 20, 'Chemistry', 2, 'Male', '9000000025', '20 Civil Lines', 'Delhi', 'DL'),
('Ritika Saxena', 'ritika@example.com', 'pass123', 21, 'Biology', 3, 'Female', '9000000026', '22 Civil Lines', 'Delhi', 'DL'),
('Varun Kapoor', 'varun@example.com', 'pass123', 19, 'History', 1, 'Male', '9000000027', '24 Connaught Place', 'Delhi', 'DL'),
('Ankit Srivastava', 'ankit@example.com', 'pass123', 22, 'Economics', 4, 'Male', '9000000028', '26 Connaught Place', 'Delhi', 'DL'),
('Shreya Bhatt', 'shreya@example.com', 'pass123', 20, 'Psychology', 2, 'Female', '9000000029', '30 Navrangpura', 'Ahmedabad', 'GJ'),
('Deepak Pillai', 'deepak@example.com', 'pass123', 21, 'Sociology', 3, 'Male', '9000000030', '32 MG Road', 'Kochi', 'KL'),

('Lakshmi Narayan', 'lakshmi@example.com', 'pass123', 19, 'Literature', 1, 'Female', '9000000031', '34 Temple Road', 'Mysore', 'KA'),
('Rakesh Tiwari', 'rakesh@example.com', 'pass123', 22, 'Philosophy', 4, 'Male', '9000000032', '36 Temple Road', 'Mysore', 'KA'),
('Divya Menon', 'divya@example.com', 'pass123', 20, 'Art', 2, 'Female', '9000000033', '40 Beach Road', 'Kochi', 'KL'),
('Mohit Arora', 'mohit@example.com', 'pass123', 21, 'Music', 3, 'Male', '9000000034', '42 Beach Road', 'Kochi', 'KL'),
('Nisha Thakur', 'nisha@example.com', 'pass123', 19, 'Theater', 1, 'Female', '9000000035', '44 Mall Road', 'Shimla', 'HP'),
('Kunal Desai', 'kunal@example.com', 'pass123', 22, 'Film', 4, 'Male', '9000000036', '46 CG Road', 'Ahmedabad', 'GJ'),
('Bhavna Goyal', 'bhavna@example.com', 'pass123', 20, 'Design', 2, 'Female', '9000000037', '50 MI Road', 'Jaipur', 'RJ'),
('Rajat Malhotra', 'rajat@example.com', 'pass123', 21, 'Architecture', 3, 'Male', '9000000038', '52 MI Road', 'Jaipur', 'RJ'),
('Komal Pandey', 'komal@example.com', 'pass123', 19, 'Law', 1, 'Female', '9000000039', '54 Civil Lines', 'Kanpur', 'UP'),
('Aman Chauhan', 'aman@example.com', 'pass123', 22, 'Business', 4, 'Male', '9000000040', '56 Civil Lines', 'Kanpur', 'UP');




INSERT INTO preferences (user_id, hostel_block, sleep_time, study_habit, cleanliness, smoking, guest_freq, atheism, habits, vegetarian, introvert) VALUES
(1, 'Block A', 'early', 'quiet', 'neat', 'no', 'rarely', 'neutral', 'Morning yoga', 'vegetarian', 'introvert'),
(2, 'Block A', 'early', 'quiet', 'neat', 'no', 'rarely', 'neutral', 'Gym mornings', 'no_preference', 'ambivert'),
(3, 'Block A', 'moderate', 'mix', 'moderate', 'no', 'occasionally', 'agnostic', NULL, 'mostly_veg', 'ambivert'),
(4, 'Block A', 'late', 'group', 'messy', 'social', 'often', 'prefer_not_say', 'Late night coding', 'meat_eater', 'extrovert'),
(5, 'Block B', 'early', 'silent', 'very_neat', 'no', 'never', 'spiritual', 'Meditation', 'vegetarian', 'introvert'),
(6, 'Block B', 'early', 'quiet', 'neat', 'no', 'rarely', 'spiritual', NULL, 'vegetarian', 'introvert'),
(7, 'Block B', 'late', 'group', 'moderate', 'social', 'often', 'neutral', 'Hosts study groups', 'no_preference', 'extrovert'),
(8, 'Block B', 'very_late', 'collaborative', 'messy', 'daily', 'very_often', 'neutral', 'Gaming nights', 'meat_eater', 'social_butterfly'),
(9, 'Block C', 'moderate', 'mix', 'neat', 'no_preference', 'occasionally', 'neutral', NULL, 'vegetarian', 'ambivert'),
(10, 'Block C', 'moderate', 'quiet', 'neat', 'no', 'rarely', 'neutral', 'Reads books', 'mostly_veg', 'introvert'),
(11, 'Block C', 'late', 'group', 'moderate', 'social', 'often', 'agnostic', NULL, 'no_preference', 'ambivert'),
(12, 'Block C', 'early', 'quiet', 'very_neat', 'must_not', 'rarely', 'neutral', 'Early riser', 'vegetarian', 'introvert'),
(13, 'Block A', 'early', 'quiet', 'neat', 'no', 'rarely', 'prefer_not_say', NULL, 'vegetarian', 'introvert'),
(14, 'Block A', 'early', 'quiet', 'neat', 'no', 'rarely', 'neutral', NULL, 'vegetarian', 'ambivert'),
(15, 'Block A', 'late', 'mix', 'moderate', 'no', 'occasionally', 'spiritual', 'Music lover', 'no_preference', 'extrovert'),
(16, 'Block B', 'late', 'group', 'messy', 'social', 'often', 'neutral', 'Party weekends', 'meat_eater', 'social_butterfly'),
(17, 'Block C', 'moderate', 'mix', 'neat', 'no', 'occasionally', 'neutral', NULL, 'mostly_veg', 'ambivert'),
(18, 'Block A', 'moderate', 'quiet', 'neat', 'no', 'rarely', 'agnostic', 'Journaling', 'vegetarian', 'introvert'),
(19, 'Block B', 'early', 'silent', 'very_neat', 'must_not', 'never', 'spiritual', 'Meditation', 'vegetarian', 'shy_introvert'),
(20, 'Block C', 'very_late', 'collaborative', 'very_messy', 'social', 'very_often', 'neutral', 'Night owl coder', 'meat_eater', 'extrovert'),

(21, 'Block A', 'early', 'quiet', 'neat', 'no', 'rarely', 'neutral', 'Gym + study', 'vegetarian', 'introvert'),
(22, 'Block A', 'moderate', 'mix', 'moderate', 'no', 'occasionally', 'neutral', NULL, 'no_preference', 'ambivert'),
(23, 'Block A', 'late', 'group', 'messy', 'social', 'often', 'neutral', 'Cricket lover', 'meat_eater', 'extrovert'),
(24, 'Block B', 'early', 'quiet', 'neat', 'no', 'rarely', 'spiritual', NULL, 'vegetarian', 'introvert'),
(25, 'Block B', 'moderate', 'mix', 'moderate', 'no_preference', 'occasionally', 'neutral', NULL, 'mostly_veg', 'ambivert'),
(26, 'Block B', 'late', 'group', 'messy', 'social', 'often', 'neutral', 'Late Netflix', 'no_preference', 'extrovert'),
(27, 'Block C', 'early', 'quiet', 'very_neat', 'no', 'rarely', 'neutral', NULL, 'vegetarian', 'introvert'),
(28, 'Block C', 'moderate', 'mix', 'moderate', 'no', 'occasionally', 'neutral', NULL, 'no_preference', 'ambivert'),
(29, 'Block C', 'late', 'group', 'messy', 'social', 'often', 'neutral', 'Night talks', 'meat_eater', 'extrovert'),
(30, 'Block A', 'early', 'quiet', 'neat', 'no', 'rarely', 'spiritual', NULL, 'vegetarian', 'introvert'),

(31, 'Block B', 'moderate', 'mix', 'moderate', 'no_preference', 'occasionally', 'neutral', NULL, 'mostly_veg', 'ambivert'),
(32, 'Block C', 'late', 'group', 'messy', 'social', 'often', 'neutral', 'Music loud', 'no_preference', 'extrovert'),
(33, 'Block A', 'early', 'quiet', 'very_neat', 'no', 'rarely', 'spiritual', NULL, 'vegetarian', 'introvert'),
(34, 'Block B', 'moderate', 'mix', 'moderate', 'no', 'occasionally', 'neutral', NULL, 'no_preference', 'ambivert'),
(35, 'Block C', 'late', 'group', 'messy', 'social', 'often', 'neutral', 'Dance reels', 'no_preference', 'extrovert'),
(36, 'Block A', 'early', 'quiet', 'neat', 'no', 'rarely', 'neutral', NULL, 'vegetarian', 'introvert'),
(37, 'Block B', 'moderate', 'mix', 'moderate', 'no_preference', 'occasionally', 'neutral', NULL, 'mostly_veg', 'ambivert'),
(38, 'Block C', 'late', 'group', 'messy', 'social', 'often', 'neutral', 'Football fan', 'meat_eater', 'extrovert'),
(39, 'Block A', 'early', 'quiet', 'very_neat', 'must_not', 'never', 'spiritual', NULL, 'vegetarian', 'introvert'),
(40, 'Block B', 'very_late', 'collaborative', 'very_messy', 'social', 'very_often', 'neutral', 'Streamer', 'meat_eater', 'social_butterfly');





INSERT INTO rooms (room_number, capacity) VALUES
('A-101', 2), ('A-102', 2), ('A-103', 2), ('A-104', 2), ('A-105', 2), ('A-106', 2), ('A-107', 2), ('A-108', 2), ('A-109', 2), ('A-110', 2),
('B-201', 2), ('B-202', 2), ('B-203', 2), ('B-204', 2), ('B-205', 2), ('B-206', 2), ('B-207', 2), ('B-208', 2), ('B-209', 2), ('B-210', 2),
('C-301', 2), ('C-302', 2), ('C-303', 2), ('C-304', 2), ('C-305', 2), ('C-306', 2), ('C-307', 2), ('C-308', 2), ('C-309', 2), ('C-310', 2);


INSERT INTO room_assignments (student_id, room_id) VALUES
(1, 1), (2, 1),
(3, 2), (4, 2),
(5, 11), (6, 11),
(7, 12), (8, 12),
(9, 21), (10, 21),
(11, 22), (12, 22),
(13, 3), (14, 3),
(15, 13), (16, 13),
(17, 23), (18, 23),
(19, 4), (20, 4);


INSERT INTO compatibility (user1_id, user2_id, preference1_id, preference2_id, score) VALUES

(1, 2, 1, 2, 78), (1, 3, 1, 3, 62), (1, 4, 1, 4, 38),
(2, 1, 2, 1, 78), (2, 3, 2, 3, 58), (2, 4, 2, 4, 35),
(3, 1, 3, 1, 62), (3, 2, 3, 2, 58), (3, 4, 3, 4, 45),
(4, 1, 4, 1, 38), (4, 2, 4, 2, 35), (4, 3, 4, 3, 45),
(5, 6, 5, 6, 82), (5, 7, 5, 7, 48), (5, 8, 5, 8, 22),
(6, 5, 6, 5, 82), (6, 7, 6, 7, 44), (6, 8, 6, 8, 20),
(7, 5, 7, 5, 48), (7, 6, 7, 6, 44), (7, 8, 7, 8, 40),
(8, 5, 8, 5, 22), (8, 6, 8, 6, 20), (8, 7, 8, 7, 40),
(9, 10, 9, 10, 74), (9, 11, 9, 11, 55), (9, 12, 9, 12, 52),
(10, 9, 10, 9, 74), (10, 11, 10, 11, 50), (10, 12, 10, 12, 68),
(11, 9, 11, 9, 55), (11, 10, 11, 10, 50), (11, 12, 11, 12, 42),
(12, 9, 12, 9, 52), (12, 10, 12, 10, 68), (12, 11, 12, 11, 42),
(13, 14, 13, 14, 80), (13, 15, 13, 15, 58), (13, 16, 13, 16, 32),
(14, 13, 14, 13, 80), (14, 15, 14, 15, 54), (14, 16, 14, 16, 30),
(15, 13, 15, 13, 58), (15, 14, 15, 14, 54), (15, 16, 15, 16, 46),
(16, 13, 16, 13, 32), (16, 14, 16, 14, 30), (16, 15, 16, 15, 46),
(17, 18, 17, 18, 76), (17, 19, 17, 19, 60), (17, 20, 17, 20, 28),
(18, 17, 18, 17, 76), (18, 19, 18, 19, 58), (18, 20, 18, 20, 25),
(19, 17, 19, 17, 60), (19, 18, 19, 18, 58), (19, 20, 19, 20, 22),
(20, 17, 20, 17, 28), (20, 18, 20, 18, 25), (20, 19, 20, 19, 22);
