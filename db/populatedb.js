import pg from "pg";
const { Client } = pg;

const isFirstScriptExecution = async (client) => {
  const query = `SELECT NOT EXISTS (
        SELECT 1 
        FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'users'
        ) AS table_not_exists;`;

  const { rows } = await client.query(query);
  return rows[0].table_not_exists;
};

const SQL = `CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR (255) UNIQUE,
 password VARCHAR (255));

CREATE TABLE members (user_id INTEGER, admin BOOLEAN DEFAULT FALSE,
 FOREIGN KEY (user_id) REFERENCES users (id) );

CREATE TABLE posts (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
user_id INTEGER, title VARCHAR(255), message VARCHAR(255),
 date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) );
`;

const main = async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  if (await isFirstScriptExecution(client)) {
    await client.query(SQL);
    console.log("database has been populated");
  }
  await client.end();
};

main();
