// src/commands/history.js
import { getHistory } from '../db.js';

export default function history(bot) {
  bot.command('myhistory', async (ctx) => {
    const rows = await getHistory(ctx.from.id);

    if (!rows.length) {
      return ctx.reply('🕒 История практик пуста.');
    }

    const lines = rows.map(r => {
      const date = new Date(r.completed_at).toLocaleString('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
      const emoji = r.type === 'morning' ? '🌅' : '🌙';
      return `${emoji} ${r.type} — ${date}`;
    });

    ctx.reply('📜 История практик:\n\n' + lines.join('\n'));
  });
}
