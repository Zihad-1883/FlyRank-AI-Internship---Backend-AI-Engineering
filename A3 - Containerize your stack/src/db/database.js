import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
});

export const initDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(createTableQuery);

  const checkSeedQuery = `SELECT COUNT(*) FROM tasks;`;
  const result = await pool.query(checkSeedQuery);
  const count = parseInt(result.rows[0].count, 10);

  if (count === 0) {
    const seedQuery = `
      INSERT INTO tasks (title, done) VALUES
      ('Finish the project', false),
      ('Write documentation', false),
      ('Deploy to production', false);
    `;
    await pool.query(seedQuery);
    console.log('Seeded 3 default tasks into PostgreSQL');
  }
};
