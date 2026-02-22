import fs from "fs/promises";
import path from "path";
import pool from "../pool.js";
import { fileURLToPath } from "url";

async function runMigrations() {
  await pool.query(`
        create table if not exists migrations (
            id serial primary key,
            name varchar(255) unique not null,
            applied_at timestamp default now()
        );
    `);

  const __filename = fileURLToPath(import.meta.url);
  const migrationsDir = path.dirname(__filename);

  const files = await fs.readdir(migrationsDir);
  const sqlfiles = files.filter((f) => f.endsWith(".sql")).sort();

  for (const file of sqlfiles) {
    const applied = await pool.query(
      "select id from migrations where name = $1",
      [file],
    );
    if (applied.rowCount > 0) {
      console.log(`Skipping ${file} (already applied)`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);

    await pool.query("insert into migrations (name) values ($1)", [file]);
  }

  await pool.end();
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
