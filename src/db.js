import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

// USERS
export async function upsertUser(ctx) {
  await sql`
    INSERT INTO users (user_id, username, first_name, last_name)
    VALUES (${ctx.from.id}, ${ctx.from.username}, ${ctx.from.first_name}, ${ctx.from.last_name})
    ON CONFLICT (user_id) DO UPDATE SET
      username = EXCLUDED.username,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name
  `;
}

// STATS
export async function addStat(userId, type) {
  await sql`INSERT INTO stats (user_id, type) VALUES (${userId}, ${type})`;
}

export async function getStats(userId) {
  const [row] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE type = 'morning') AS morning,
      COUNT(*) FILTER (WHERE type = 'evening') AS evening
    FROM stats WHERE user_id = ${userId}
  `;
  return {
    morning: Number(row.morning),
    evening: Number(row.evening)
  };
}
