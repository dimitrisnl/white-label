-- migrate:up
CREATE TYPE membership_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

CREATE TABLE memberships (
  org_id uuid REFERENCES orgs (id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users (id) ON DELETE CASCADE NOT NULL,

  role membership_role DEFAULT 'MEMBER' NOT NULL,

  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  CONSTRAINT memberships_org_id_user_id_pk PRIMARY KEY (org_id, user_id)
);

-- Add indexes
CREATE INDEX idx_memberships_org_id ON memberships (org_id);
CREATE INDEX idx_memberships_user_id ON memberships (user_id);

-- migrate:down
-- Drop the table
DROP TABLE memberships;

-- Drop indexes
DROP INDEX IF EXISTS idx_memberships_org_id;
DROP INDEX IF EXISTS idx_memberships_user_id;

-- Drop the type
DROP TYPE IF EXISTS membership_role;