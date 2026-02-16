-- Fix newsletter RLS policies for proper permission structure
-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can delete newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can update newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Authenticated users can view newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Anyone can insert newsletter subscriptions" ON newsletter_subscriptions;

-- Policy for public users to insert (newsletter signup)
CREATE POLICY "Public can insert newsletter subscriptions" ON newsletter_subscriptions
    TO PUBLIC
    FOR INSERT WITH CHECK (
        (email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text
    );

-- Policy for authenticated users (admin) to view all subscriptions
CREATE POLICY "Authenticated users can view newsletter subscriptions" ON newsletter_subscriptions
    TO AUTHENTICATED
    FOR SELECT USING (
        (auth.role() = 'authenticated'::text)
    );

-- Policy for authenticated users (admin) to update subscriptions
CREATE POLICY "Authenticated users can update newsletter subscriptions" ON newsletter_subscriptions
    TO AUTHENTICATED
    FOR UPDATE USING (
        (auth.role() = 'authenticated'::text)
    );

-- Policy for authenticated users (admin) to delete subscriptions
CREATE POLICY "Authenticated users can delete newsletter subscriptions" ON newsletter_subscriptions
    TO AUTHENTICATED
    FOR DELETE USING (
        (auth.role() = 'authenticated'::text)
    );
