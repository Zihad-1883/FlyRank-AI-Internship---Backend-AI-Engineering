import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDb } from './db/database.js';
import { router as tasksRouter, statsRouter } from './tasks/tasks.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, './tasks/swagger.json'), 'utf8')
);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({
    name: 'Task Manager CRUD API (Containerized Postgres + ESNext)',
    version: '1.0.0',
    database: 'PostgreSQL (Docker)',
    docs: '/api-docs',
    endpoints: ['/tasks', '/stats', '/health'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/tasks', tasksRouter);
app.use('/stats', statsRouter);

const startServer = async () => {
  try {
    await initDb();
    console.log('PostgreSQL Database connected & initialized.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
