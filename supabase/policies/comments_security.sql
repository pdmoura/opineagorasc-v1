-- Security policy for comments table
-- Adds IP address and rate limiting automatically

CREATE POLICY "add_comment_security" ON "comments"
FOR INSERT WITH CHECK (
  -- Validate required fields
  auth.role() = 'authenticated' AND
  post_id IS NOT NULL AND
  name IS NOT NULL AND
  email IS NOT NULL AND
  content IS NOT NULL AND
  LENGTH(TRIM(content)) >= 10 AND
  LENGTH(TRIM(name)) >= 2 AND
  email ~* '^[^@]+@[^@]+\.[^@]+$'
);

-- Allow users to see approved comments
CREATE POLICY "view_approved_comments" ON "comments"
FOR SELECT USING (
  status = 'approved'
);

-- Allow users to insert comments (with security checks)
CREATE POLICY "insert_comments" ON "comments"
FOR INSERT WITH CHECK (
  -- Auto-add IP and timestamp
  ip_address = inet_client_addr() AND
  created_at = NOW() AND
  -- Default status to pending
  status = 'pending' AND
  -- Rate limiting: max 5 comments per hour per IP
  (
    SELECT COUNT(*) FROM comments 
    WHERE ip_address = inet_client_addr() 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) < 5
);

-- Only allow users to update their own comments (if needed in future)
CREATE POLICY "update_own_comments" ON "comments"
FOR UPDATE USING (
  auth.uid()::text = user_id::text
);

-- Allow admins to manage comments
CREATE POLICY "admin_comments" ON "comments"
FOR ALL USING (
  auth.jwt() ->> 'role' AND
  auth.jwt() ->> 'role' = 'admin'
);
