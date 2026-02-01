-- Fix NULL values in program_bookings table for group booking fields
-- This script should be run on your MySQL database to fix the HttpMessageNotWritableException

-- Update is_group_booking column to set FALSE for NULL values
UPDATE program_bookings SET is_group_booking = FALSE WHERE is_group_booking IS NULL;

-- Update group_size column to set 1 for NULL values (assuming existing bookings are solo bookings)
UPDATE program_bookings SET group_size = 1 WHERE group_size IS NULL;

-- Update total_amount column to set ticket_price for NULL values (assuming existing bookings have ticket_price)
UPDATE program_bookings SET total_amount = ticket_price WHERE total_amount IS NULL;

-- Verify the updates
SELECT COUNT(*) as total_bookings,
       COUNT(CASE WHEN is_group_booking IS NULL THEN 1 END) as null_group_bookings,
       COUNT(CASE WHEN group_size IS NULL THEN 1 END) as null_group_sizes,
       COUNT(CASE WHEN total_amount IS NULL THEN 1 END) as null_total_amounts
FROM program_bookings; 