-- migrate:up
CREATE TABLE orgs (
  id uuid PRIMARY KEY NOT NULL,
  name varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
  
);


-- migrate:down
DROP TABLE orgs;
