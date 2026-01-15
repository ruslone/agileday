import { Telegraf, Markup } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

// Сейчас данные хранятся в памяти - при перезапуске все сбросится
// Вместо Map лучше использовать базу данных
const userState = new Map();

// Для Vercel можно использовать:
// - Vercel KV (Redis) - бесплатный тариф
// - PostgreSQL (Vercel Postgres)
// - Supabase
// - или любой внешний сервис
// ===== Команды =====



// Middleware для логирования
bot.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`Update ${ctx.update.update_id} processed in ${ms}ms`);
});

// Обработка ошибок бота
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.update.update_id}:`, err);
  ctx.reply('Произошла ошибка. Попробуйте позже.');
});

bot.start((ctx) => {
  ctx.reply(
    'Agile Reminder Bot запущен.\n\n' +
    'Доступные команды:\n' +
    '/morning — утренняя практика\n' +
    '/evening — вечерняя практика\n' +
    '/stats — статистика'
  );
});

bot.command('morning', (ctx) => {
  ctx.reply(
    '🌅 Утренняя практика:\n\n' +
    '1. Главный фокус дня?\n' +
    '2. 1–3 приоритетные задачи?\n' +
    '3. Возможные блокеры?\n',
    Markup.inlineKeyboard([
      Markup.button.callback('✅ Выполнено', 'morning_done'),
      Markup.button.callback('⏭ Пропустить', 'morning_skip'),
    ])
  );
});

bot.command('evening', (ctx) => {
  ctx.reply(
    '🌙 Вечерняя практика:\n\n' +
    '1. Что было сделано хорошо?\n' +
    '2. Что не получилось?\n' +
    '3. Что улучшить завтра?\n',
    Markup.inlineKeyboard([
      Markup.button.callback('✅ Выполнено', 'evening_done'),
      Markup.button.callback('⏭ Пропустить', 'evening_skip'),
    ])
  );
});

bot.command('stats', (ctx) => {
  const id = ctx.from.id;
  const stats = userState.get(id) || { morning: 0, evening: 0 };

  ctx.reply(
    `📊 Статистика:\n\n` +
    `Утро: ${stats.morning}\n` +
    `Вечер: ${stats.evening}`
  );
});

// ===== Callback handlers =====

bot.action('morning_done', (ctx) => {
  const id = ctx.from.id;
  const stats = userState.get(id) || { morning: 0, evening: 0 };
  stats.morning += 1;
  userState.set(id, stats);

  ctx.answerCbQuery();
  ctx.editMessageText('✅ Утренняя практика выполнена');
});

bot.action('evening_done', (ctx) => {
  const id = ctx.from.id;
  const stats = userState.get(id) || { morning: 0, evening: 0 };
  stats.evening += 1;
  userState.set(id, stats);

  ctx.answerCbQuery();
  ctx.editMessageText('✅ Вечерняя практика выполнена');
});

bot.action(['morning_skip', 'evening_skip'], (ctx) => {
  ctx.answerCbQuery();
  ctx.editMessageText('⏭ Практика пропущена');
});

// ===== Webhook handler для Vercel =====



export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(200).send('OK');
    }

    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).send('Internal Server Error');
  }
}