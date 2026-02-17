-- ========================================
-- 03_FIX_ADMIN_PERMISSIONS.sql
-- ========================================
-- Fix RLS policies to allow admins to see all content
-- Execute this AFTER 02_SECURITY_SETUP.sql

-- 1. Fix Posts Policies
-- Pass 1: Drop existing restrictive policies if needed (or just add new one)
-- The existing policy "Enable read access for all users" only allows status='published'
-- We keep that for anon/general access, but add a specific one for admins.

-- Authenticated users (Admins) can see EVERYTHING in posts
CREATE POLICY "Enable full read access for authenticated users" ON posts
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');

-- 2. Fix Ads Policies
-- Similarly for ads, existing policy "Enable read access for all users ads" only allows status='approved'

-- Authenticated users (Admins) can see EVERYTHING in ads
CREATE POLICY "Enable full read access for authenticated users ads" ON ads
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');

-- 3. Fix Newsletter Policies
-- Existing policy "Authenticated users can view newsletter subscriptions" should work, 
-- but let's drop and re-create to be extremely sure it covers everything.

DROP POLICY IF EXISTS "Authenticated users can view newsletter subscriptions" ON newsletter_subscriptions;

CREATE POLICY "Authenticated users can view newsletter subscriptions" ON newsletter_subscriptions
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');

-- 4. Verify
DO $$
BEGIN
    RAISE NOTICE '=== ADMIN PERMISSIONS UPDATE COMPLETED ===';
    RAISE NOTICE 'Added policies:';
    RAISE NOTICE '  - Enable full read access for authenticated users (posts)';
    RAISE NOTICE '  - Enable full read access for authenticated users ads (ads)';
    RAISE NOTICE '  - Authenticated users can view newsletter subscriptions (re-created)';
    RAISE NOTICE 'Admins should now be able to see drafts, unapproved ads, and all emails.';
END $$;
