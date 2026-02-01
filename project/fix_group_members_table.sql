-- Fix group_members table structure
-- Add missing created_at column

ALTER TABLE group_members 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Check current table structure
DESCRIBE group_members;

-- Check if there are any existing group bookings that should have members
SELECT 
    pb.id as booking_id,
    pb.student_name,
    pb.program_name,
    pb.is_group_booking,
    pb.group_size,
    COUNT(gm.id) as actual_members
FROM program_bookings pb
LEFT JOIN group_members gm ON pb.id = gm.booking_id
WHERE pb.is_group_booking = TRUE
GROUP BY pb.id;

-- Show all group bookings
SELECT 
    id,
    student_name,
    program_name,
    is_group_booking,
    group_size,
    total_amount,
    created_at
FROM program_bookings 
WHERE is_group_booking = TRUE
ORDER BY created_at DESC; 