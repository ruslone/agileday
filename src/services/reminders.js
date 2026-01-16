import { sql } from '../db.js';

export async function setReminder(userId, type, hour, minute) {
  await sql`
    INSERT INTO reminders (user_id, type, hour, minute, is_active)
    VALUES (${userId}, ${type}, ${hour}, ${minute}, true)
    ON CONFLICT (user_id, type)
    DO UPDATE SET hour = EXCLUDED.hour, minute = EXCLUDED.minute, is_active = true
  `;
  return true;
}

export async function getReminder(userId, type) {
  const rows = await sql`
    SELECT * FROM reminders
    WHERE user_id = ${userId} AND type = ${type}
  `;
  return rows[0] || null;
}

export async function toggleReminder(userId, type, isActive) {
  await sql`
    UPDATE reminders
    SET is_active = ${isActive}
    WHERE user_id = ${userId} AND type = ${type}
  `;
}

export async function getActiveRemindersForTime(hour, minute) {
  return sql`
    SELECT r.*, u.user_id
    FROM reminders r
    JOIN users u ON u.user_id = r.user_id
    WHERE r.is_active = true
      AND r.hour = ${hour}
      AND r.minute = ${minute}
  `;
}
