import { Client } from "@neondatabase/serverless"

async function createvTokensTable(client) {
  await client.query(
    `CREATE TABLE IF NOT EXISTS verification_token(
      identifier TEXT NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      token TEXT NOT NULL,
      PRIMARY KEY (identifier, token)
    );`
  );

  console.log(
    "\x1b[1m\x1b[36m%s \x1b[0m%s",
    "notice",
    'Successfully created "verification_token" table'
  );
}

async function createAccountsTable(client) {
  await client.query(
    `CREATE TABLE IF NOT EXISTS accounts(
      id SERIAL,
      "userId" INTEGER NOT NULL,
      type VARCHAR(255) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      "providerAccountId" VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      id_token TEXT,
      scope TEXT,
      session_state TEXT,
      token_type TEXT,
    
      PRIMARY KEY (id)
    );`
  );

  console.log(
    "\x1b[1m\x1b[36m%s \x1b[0m%s",
    "notice",
    'Successfully created "accounts" table'
  );
}

async function createSessionsTable(client) {
  await client.query(
    `CREATE TABLE IF NOT EXISTS sessions(
      id SERIAL,
      "userId" INTEGER NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      "sessionToken" VARCHAR(255) NOT NULL,
    
      PRIMARY KEY (id)
    );`
  );

  console.log(
    "\x1b[1m\x1b[36m%s \x1b[0m%s",
    "notice",
    'Successfully created "sessions" table'
  );
}

async function createUsersTable(client) {
  await client.query(
    `CREATE TABLE IF NOT EXISTS users(
      id SERIAL,
      name VARCHAR(255),
      email VARCHAR(255),
      "emailVerified" TIMESTAMPTZ,
      image TEXT,
    
      PRIMARY KEY (id)
    );`
  );

  console.log(
    "\x1b[1m\x1b[36m%s \x1b[0m%s",
    "notice",
    'Successfully created "users" table'
  );
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  await client.connect();
  client.on("error", (err) => {
    console.log("something went wrong :(", err.stack);
  });
  client.on("end", () => {
    console.log("\x1b[1m\x1b[36m%s \x1b[0m%s", "notice", "Client disconnected");
  });

  await createvTokensTable(client);
  await createAccountsTable(client);
  await createSessionsTable(client);
  await createUsersTable(client);

  client.end();
}

main().catch((err) => {
  console.log(
    "\x1b[1m\x1b[37m\x1b[41m%s\x1b[0m\x1b[1m %s\x1b[0m %s",
    "ERROR",
    "500",
    "Connection failed"
  );
  console.log(err.stack);
});
