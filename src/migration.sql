-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    username TEXT
);

-- Таблица напоминаний
CREATE TABLE IF NOT EXISTS reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    type TEXT NOT NULL, -- 'morning' или 'evening'
    hour INT NOT NULL,
    minute INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (user_id, type)
);

-- Таблица статистики
CREATE TABLE IF NOT EXISTS stats (
    user_id BIGINT REFERENCES users(user_id),
    type TEXT NOT NULL, -- 'morning' или 'evening'
    count INT DEFAULT 0,
    PRIMARY KEY (user_id, type)
);

-- Таблица истории практик
CREATE TABLE IF NOT EXISTS practice_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    type TEXT NOT NULL, -- 'morning' или 'evening'
    completed_at TIMESTAMPTZ DEFAULT NOW()
);
