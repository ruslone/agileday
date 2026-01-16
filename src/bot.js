import { Telegraf, session } from 'telegraf'; // session теперь импортируется из telegraf

import registerCommands from './commands/index.js';
import registerActions from './actions/index.js';

export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session()); // теперь это работает

registerCommands(bot);
registerActions(bot);

bot.catch((err, ctx) => {
  console.error('Bot error', err);
});
