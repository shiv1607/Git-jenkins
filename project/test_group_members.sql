-- Test script to verify group_members table and add test data

-- 1. Check table structure
DESCRIBE group_members;

-- 2. Check if there are any existing records
SELECT COUNT(*) as total_group_members FROM group_members;

-- 3. Check recent program bookings
SELECT 
    id,
    student_name,
    program_name,
    is_group_booking,
    group_size
FROM program_bookings 
WHERE is_group_booking = TRUE
ORDER BY id DESC
LIMIT 5;

-- 4. Try to insert a test group member (replace booking_id with actual booking ID)
-- INSERT INTO group_members (booking_id, member_name, member_email, member_phone, created_at) 
-- VALUES (1, 'Test Member', 'test@example.com', '1234567890', NOW());

-- 5. Check if the test insert worked
-- SELECT * FROM group_members WHERE member_name = 'Test Member'; 