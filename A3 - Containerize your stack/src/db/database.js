import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
});

export const initDb = async (retries = 5, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.log(`Database connection attempt ${attempt} failed (${error.message}). Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
