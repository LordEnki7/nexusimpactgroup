import pg from "pg";

const { Client } = pg;

async function initDb() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  console.log("Dropping existing tables to ensure clean schema...");

  await client.query(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);

  console.log("All tables dropped. Ready for fresh schema push.");
  await client.end();
}

initDb().catch((err) => {
  console.error("DB init error:", err.message);
  process.exit(1);
});
