-- Add group booking fields to programs table
-- This script should be run on your MySQL database to support solo/group booking types

-- Add booking_type column with default value 'solo'
ALTER TABLE programs ADD COLUMN booking_type VARCHAR(10) DEFAULT 'solo';

-- Add number_of_teams column (nullable for existing solo programs)
ALTER TABLE programs ADD COLUMN number_of_teams INT NULL;

-- Add max_group_members column (nullable for existing solo programs)
ALTER TABLE programs ADD COLUMN max_group_members INT NULL;

-- Update existing programs to have booking_type = 'solo' if not already set
UPDATE programs SET booking_type = 'solo' WHERE booking_type IS NULL;

-- Verify the changes
SELECT COUNT(*) as total_programs,
       COUNT(CASE WHEN booking_type = 'solo' THEN 1 END) as solo_programs,
       COUNT(CASE WHEN booking_type = 'group' THEN 1 END) as group_programs,
       COUNT(CASE WHEN number_of_teams IS NOT NULL THEN 1 END) as programs_with_teams,
       COUNT(CASE WHEN max_group_members IS NOT NULL THEN 1 END) as programs_with_group_members
FROM programs; 