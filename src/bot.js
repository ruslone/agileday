import { Telegraf } from 'telegraf';
import session from 'telegraf/session';

import registerCommands from './commands/index.js';
import registerActions from './actions/index.js';

export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

registerCommands(bot);
registerActions(bot);

bot.catch((err, ctx) => {
  console.error('Bot error', err);
});
