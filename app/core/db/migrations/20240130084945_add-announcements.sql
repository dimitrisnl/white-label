-- migrate:up
CREATE TABLE announcements (
  id uuid PRIMARY KEY NOT NULL,
  org_id uuid NOT NULL REFERENCES orgs (id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  content varchar(255) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  published_at timestamptz DEFAULT NULL
);
-- Add index
CREATE INDEX idx_announcements_org_id ON announcements (org_id);


-- migrate:down
DROP TABLE announcements;
-- Drop the index
DROP INDEX IF EXISTS idx_announcements_org_id;