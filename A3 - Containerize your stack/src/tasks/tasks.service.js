import { pool } from '../db/database.js';

export const getAllTasks = async (query = {}) => {
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (query.isDone !== undefined) {
    params.push(query.isDone === 'true' ? true : false);
    sql += ` AND done = $${params.length}`;
  }

  if (query.search !== undefined && query.search.trim() !== '') {
    params.push(`${query.search.trim().toLowerCase()}%`);
    sql += ` AND title ILIKE $${params.length}`
  }

  sql += ' ORDER BY id ASC';

  const result = await pool.query(sql, params);
  const rows = result.rows;

  return {
    statusCode: 200,
    data: rows,
  };
};

export const getSingleTask = async (id) => {
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1;', [id]);

  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      message: 'Task not found',
    };
  }

  return {
    statusCode: 200,
    data: result.rows[0],
  };
};

export const createTask = async (payload) => {
  // TODO: Write Postgres DB query here (INSERT INTO tasks...)
  return {
    statusCode: 201,
    data: null,
  };
};

export const updateTask = async (id, payload) => {
  // TODO: Write Postgres DB query here (UPDATE tasks SET...)
  return {
    statusCode: 200,
    data: null,
  };
};

export const deleteTask = async (id) => {
  // TODO: Write Postgres DB query here (DELETE FROM tasks WHERE id = $1)
  return {
    statusCode: 204,
    message: 'Task deleted successfully',
  };
};

export const getTaskStats = async () => {
  // TODO: Write Postgres DB query here (SELECT COUNT(*)...)
  return {
    statusCode: 200,
    data: { count: 0 },
  };
};
