-- migrate:up
CREATE TABLE orgs (
  id uuid PRIMARY KEY NOT NULL,
  name varchar(255) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);


-- migrate:down
DROP TABLE orgs;
