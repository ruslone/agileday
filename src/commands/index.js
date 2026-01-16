import start from './start.js';
import practice from './practice.js';
import history from './history.js';

export default function registerCommands(bot) {
  start(bot);
  practice(bot);
  history(bot);
}
