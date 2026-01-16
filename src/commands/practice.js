import { Markup } from 'telegraf';
import { upsertUser, getStats } from '../db.js';

export default function practice(bot) {

  bot.command('morning', async (ctx) => {
    await upsertUser(ctx);
    ctx.reply(
      '🌅 Утренняя практика',
      Markup.inlineKeyboard([
        Markup.button.callback('✅ Выполнено', 'morning_done'),
        Markup.button.callback('⏭ Пропустить', 'morning_skip')
      ])
    );
  });

  bot.command('evening', async (ctx) => {
    await upsertUser(ctx);
    ctx.reply(
      '🌙 Вечерняя практика',
      Markup.inlineKeyboard([
        Markup.button.callback('✅ Выполнено', 'evening_done'),
        Markup.button.callback('⏭ Пропустить', 'evening_skip')
      ])
    );
  });

  bot.command('stats', async (ctx) => {
    const stats = await getStats(ctx.from.id);
    ctx.reply(
      `📊\nУтро: ${stats.morning}\nВечер: ${stats.evening}\nВсего: ${stats.morning + stats.evening}`
    );
  });
}
