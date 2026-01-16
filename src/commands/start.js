import { upsertUser } from '../db.js';

export default function start(bot) {
  bot.start(async (ctx) => {
    await upsertUser(ctx);

    await ctx.reply(
      'Agile Reminder Bot\n\n' +
      '/morning — утренняя практика\n' +
      '/evening — вечерняя практика\n' +
      '/stats — статистика\n' +
      '/myhistory — история\n' +
      '/setreminder — напоминания'
    );
  });
}
