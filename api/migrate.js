import { sql } from "../src/db.js";

export default async function handler(req, res) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id BIGINT PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        username TEXT
      );

      CREATE TABLE IF NOT EXISTS reminders (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(user_id),
        type TEXT NOT NULL,
        hour INT NOT NULL,
        minute INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        UNIQUE (user_id, type)
      );

      CREATE TABLE IF NOT EXISTS stats (
        user_id BIGINT REFERENCES users(user_id),
        type TEXT NOT NULL,
        count INT DEFAULT 0,
        PRIMARY KEY (user_id, type)
      );

      CREATE TABLE IF NOT EXISTS practice_history (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(user_id),
        type TEXT NOT NULL,
        completed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
