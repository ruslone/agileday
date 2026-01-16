import { addStat } from '../db.js';

export default function practiceActions(bot) {

  bot.action('morning_done', async (ctx) => {
    await addStat(ctx.from.id, 'morning');
    await ctx.editMessageText('✅ Утренняя практика выполнена');
  });

  bot.action('evening_done', async (ctx) => {
    await addStat(ctx.from.id, 'evening');
    await ctx.editMessageText('✅ Вечерняя практика выполнена');
  });

  bot.action(['morning_skip', 'evening_skip'], async (ctx) => {
    await ctx.editMessageText('⏭ Пропущено');
  });
}
