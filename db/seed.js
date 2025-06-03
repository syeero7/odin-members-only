import pg from "pg";

const SQL = `CREATE TYPE role AS ENUM ('user', 'member', 'admin');

CREATE TABLE users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR(50), last_name VARCHAR(50), email VARCHAR(255), password VARCHAR(255), role role NOT NULL DEFAULT 'user');

CREATE TABLE posts (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(255), content VARCHAR(255), created_at TIMESTAMP DEFAULT NOW(),
creator_id INTEGER, FOREIGN KEY (creator_id) REFERENCES users (id));

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`;

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

  await client.connect();
  if (await canQueryDatabase(client)) {
    await client.query(SQL);
    console.log("database has been populated");
  }
  await client.end();
}

main();

async function canQueryDatabase(client) {
  const query = `SELECT NOT EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'users'
      ) AS table_not_exists;`;

  const { rows } = await client.query(query);
  return rows[0].table_not_exists;
}
