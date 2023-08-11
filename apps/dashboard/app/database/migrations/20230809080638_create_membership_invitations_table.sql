-- migrate:up
CREATE TYPE membership_invite_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

CREATE TABLE membership_invitations (
  id uuid PRIMARY KEY NOT NULL,
  email varchar NOT NULL UNIQUE,
  role membership_role DEFAULT 'MEMBER' NOT NULL,
  status membership_invite_status DEFAULT 'PENDING' NOT NULL,
  
  org_id uuid NOT NULL REFERENCES orgs (id) ON DELETE CASCADE,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  UNIQUE (email, org_id)
);
-- Add indexe
CREATE INDEX idx_membership_invitations_org_id ON membership_invitations (org_id);


-- migrate:down
-- Drop the table
DROP TABLE membership_invitations;
-- Drop the index
DROP INDEX IF EXISTS idx_membership_invitations_org_id;
-- Drop the type
DROP TYPE IF EXISTS membership_invite_status;