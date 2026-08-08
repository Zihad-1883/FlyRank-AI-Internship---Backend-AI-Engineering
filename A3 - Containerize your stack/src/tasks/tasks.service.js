import { pool } from '../db/database.js';

export const getAllTasks = async (query = {}) => {
  let sql = 'SELECT id, title, done, created_at AS "createdAt", updated_at AS "updatedAt" FROM tasks WHERE 1=1';
  const params = [];

  if (query.done !== undefined) {
    const isDone = query.done === 'true';
    params.push(isDone);
    sql += ` AND done = $${params.length}`;
  }

  if (query.search !== undefined && query.search.trim() !== '') {
    params.push(`%${query.search.trim().toLowerCase()}%`);
    sql += ` AND LOWER(title) LIKE $${params.length}`;
  }

  sql += ' ORDER BY id ASC';

  const result = await pool.query(sql, params);

  return {
    statusCode: 200,
    data: result.rows,
  };
};

export const getSingleTask = async (id) => {
  const sql = 'SELECT id, title, done, created_at AS "createdAt", updated_at AS "updatedAt" FROM tasks WHERE id = $1';
  const result = await pool.query(sql, [id]);
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
  const { title } = payload;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return {
      statusCode: 400,
      message: 'Title is required',
    };
  }

  const dupResult = await pool.query('SELECT * FROM tasks WHERE LOWER(title) = LOWER($1)', [title.trim()]);
  if (dupResult.rows.length > 0) {
    return {
      statusCode: 400,
      message: 'Task already exists',
    };
  }

  const sql = `
    INSERT INTO tasks (title) 
    VALUES ($1) 
    RETURNING id, title, done, created_at AS "createdAt", updated_at AS "updatedAt"
  `;
  const result = await pool.query(sql, [title.trim()]);
  return {
    statusCode: 201,
    data: result.rows[0],
  };
};

export const updateTask = async (id, payload) => {
  const { title, done } = payload;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return {
      statusCode: 400,
      message: 'Invalid title',
    };
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return {
      statusCode: 400,
      message: 'Invalid done value',
    };
  }

  const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  if (taskResult.rows.length === 0) {
    return {
      statusCode: 404,
      message: 'Task not found',
    };
  }

  const currentTask = taskResult.rows[0];
  const updatedTitle = title !== undefined ? title.trim() : currentTask.title;
  const updatedDone = done !== undefined ? done : currentTask.done;

  const sql = `
    UPDATE tasks 
    SET title = $1, done = $2, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $3 
    RETURNING id, title, done, created_at AS "createdAt", updated_at AS "updatedAt"
  `;
  const result = await pool.query(sql, [updatedTitle, updatedDone, id]);

  return {
    statusCode: 200,
    data: result.rows[0],
  };
};

export const deleteTask = async (id) => {
  const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  if (taskResult.rows.length === 0) {
    return {
      statusCode: 404,
      message: 'Task not found',
    };
  }

  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return {
    statusCode: 204,
    message: 'Task deleted successfully',
  };
};

export const getTaskStats = async () => {
  const result = await pool.query('SELECT COUNT(*)::int as count FROM tasks');
  return {
    statusCode: 200,
    data: {
      total: result.rows[0].count,
    },
  };
};
