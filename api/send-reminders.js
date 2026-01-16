import { getActiveRemindersForTime } from '../src/services/reminders.js';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(200).send('OK');
  }

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  try {
    const reminders = await getActiveRemindersForTime(hour, minute);

    for (const r of reminders) {
      const text =
        r.type === 'morning'
          ? '🌅 Время утренней практики'
          : '🌙 Время вечерней практики';

      await bot.telegram.sendMessage(r.user_id, text);
    }

    res.status(200).json({ sent: reminders.length });
  } catch (e) {
    console.error('Cron error', e);
    res.status(500).send('Error');
  }
}
