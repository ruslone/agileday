import { bot } from '../src/bot.js';

const SECRET = process.env.TG_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('OK');
  }

  const token = req.headers['x-telegram-bot-api-secret-token'];

  if (token !== SECRET) {
    return res.status(403).send('Forbidden');
  }

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error');
  }
}
