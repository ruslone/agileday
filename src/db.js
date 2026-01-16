// src/db.js
import postgres from 'postgres';

export const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }, // важно для Neon + Vercel
});

// Создание/обновление статистики
export async function upsertUser(ctx) {
  const { id, first_name, last_name, username } = ctx.from;

  await sql`
    INSERT INTO users (user_id, first_name, last_name, username)
    VALUES (${id}, ${first_name}, ${last_name}, ${username})
    ON CONFLICT (user_id) DO UPDATE
    SET first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        username = EXCLUDED.username
  `;

  // Убедимся, что для пользователя есть записи в stats
  for (const type of ['morning', 'evening']) {
    await sql`
      INSERT INTO stats (user_id, type, count)
      VALUES (${id}, ${type}, 0)
      ON CONFLICT (user_id, type) DO NOTHING
    `;
  }
}

// Получение статистики
export async function getStats(userId) {
  const rows = await sql`
    SELECT type, count
    FROM stats
    WHERE user_id = ${userId}
  `;
  const stats = { morning: 0, evening: 0 };
  rows.forEach(r => (stats[r.type] = r.count));
  return stats;
}

// Добавление статистики
export async function addStat(userId, type) {
  // Обновляем счетчик
  await sql`
    INSERT INTO stats (user_id, type, count)
    VALUES (${userId}, ${type}, 1)
    ON CONFLICT (user_id, type)
    DO UPDATE SET count = stats.count + 1
  `;

  // Добавляем запись в историю
  await sql`
    INSERT INTO practice_history (user_id, type, completed_at)
    VALUES (${userId}, ${type}, NOW())
  `;
}

// Получение истории пользователя
export async function getHistory(userId) {
  return sql`
    SELECT type, completed_at
    FROM practice_history
    WHERE user_id = ${userId}
    ORDER BY completed_at DESC
  `;
}
