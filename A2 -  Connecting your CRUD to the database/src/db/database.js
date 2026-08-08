import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../tasks.db');
let dbInstance = null;

export const initDb = async () => {
    if (!dbInstance) {
        dbInstance = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
    }

    await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    const countResult = await dbInstance.get('SELECT COUNT(*) as count FROM tasks');
    if (countResult.count === 0) {
        await dbInstance.run(
            'INSERT INTO tasks (title, done) VALUES (?, ?), (?, ?), (?, ?)',
            ['Finish the project', 0, 'Write documentation', 0, 'Deploy to production', 0]
        );
    }

    return dbInstance;
};

export const getDb = async () => {
    if (!dbInstance) {
        return await initDb();
    }
    return dbInstance;
};