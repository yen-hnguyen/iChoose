DROP TABLE IF EXISTS submissions CASCADE;
  CREATE TABLE submissions (
  id SERIAL PRIMARY KEY NOT NULL,
  choice_id INTEGER REFERENCES choices(id),
  user_id INTEGER REFERENCES users(id),
  point SMALLINT

);
