-- migrate:up
CREATE TABLE users (
  id uuid PRIMARY KEY NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  name varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  email_verified boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);


-- migrate:down
DROP TABLE users;

