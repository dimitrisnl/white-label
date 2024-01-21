-- migrate:up
CREATE TABLE verify_email_tokens (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
-- Add index
CREATE INDEX idx_verify_email_tokens_user_id ON verify_email_tokens (user_id);


-- migrate:down
DROP TABLE verify_email_tokens;
-- Drop the index
DROP INDEX IF EXISTS idx_verify_email_tokens_user_id;