-- migrate:up
CREATE TYPE announcement_status AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TABLE announcements (
  id uuid PRIMARY KEY NOT NULL,
  org_id uuid NOT NULL REFERENCES orgs (id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  content text NOT NULL,
  status announcement_status DEFAULT 'DRAFT' NOT NULL,
  created_by_user_id uuid REFERENCES users (id),
  published_by_user_id uuid REFERENCES users (id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  published_at timestamptz DEFAULT NULL
);
-- Add index
CREATE INDEX idx_announcements_org_id ON announcements (org_id);
CREATE INDEX idx_announcements_status ON announcements (status);
-- migrate:down
DROP TABLE announcements;
-- Drop the index
DROP INDEX IF EXISTS idx_announcements_org_id;
DROP INDEX IF EXISTS idx_announcements_status;
DROP TYPE announcement_status;