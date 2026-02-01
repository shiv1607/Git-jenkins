-- Update existing programs to have proper booking type and capacity values
-- This script should be run after adding the new columns

-- First, let's see what we have
SELECT id, title, seat_limit, booking_type, number_of_teams, max_group_members 
FROM programs 
ORDER BY id;

-- Update all existing programs to have booking_type = 'solo' if not set
UPDATE programs SET booking_type = 'solo' WHERE booking_type IS NULL OR booking_type = '';

-- For programs with seat_limit > 0, keep them as solo bookings
-- For programs with seat_limit = 0, we need to decide what to do
-- Let's set a default seat limit for programs that have 0 seats
UPDATE programs SET seat_limit = 50 WHERE seat_limit = 0 AND booking_type = 'solo';

-- Show the updated data
SELECT id, title, seat_limit, booking_type, number_of_teams, max_group_members 
FROM programs 
ORDER BY id;

-- Verify the changes
SELECT 
    COUNT(*) as total_programs,
    COUNT(CASE WHEN booking_type = 'solo' THEN 1 END) as solo_programs,
    COUNT(CASE WHEN booking_type = 'group' THEN 1 END) as group_programs,
    COUNT(CASE WHEN seat_limit > 0 THEN 1 END) as programs_with_seats,
    COUNT(CASE WHEN number_of_teams IS NOT NULL AND number_of_teams > 0 THEN 1 END) as programs_with_teams
FROM programs; 