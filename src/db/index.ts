import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const migrationClient = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

const runMigration = async () => {
  const db = drizzle(migrationClient, { logger: true });
  await migrate(db, { migrationsFolder: "migrations" });
};

runMigration()
  .then(() => {
    console.log("Migrated");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
