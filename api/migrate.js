import sql from '../src/db.js';
import fs from 'fs';

const sqlText = fs.readFileSync('../src/migration.sql', 'utf-8');

async function migrate() {
  try {
    await sql.unsafe(sqlText);
    console.log('Миграция выполнена');
    process.exit(0);
  } catch (err) {
    console.error('Ошибка миграции', err);
    process.exit(1);
  }
}

migrate();
