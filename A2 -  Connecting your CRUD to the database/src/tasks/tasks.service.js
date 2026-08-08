import { getDb } from '../db/database.js';

export const getAllTasks = async (query) => {
  const db = await getDb();
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (query.done !== undefined) {
    const isDone = query.done === 'true' ? 1 : 0;
    sql += ' AND done = ?';
    params.push(isDone);
  }

  if (query.search !== undefined && query.search.trim() !== '') {
    sql += ' AND LOWER(title) LIKE ?';
    params.push(`%${query.search.trim().toLowerCase()}%`);
  }

  sql += ' ORDER BY id ASC';

  const rows = await db.all(sql, params);

  if (!rows || rows.length === 0) {
    return {
      statusCode: 404,
      error: 'No tasks found',
    };
  }

  const tasks = rows.map((task) => ({
    ...task,
    done: Boolean(task.done),
  }));

  return {
    statusCode: 200,
    data: tasks,
  };
};

export const getSingleTask = async (id) => {
  const db = await getDb();
  const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);

  if (!task) {
    return {
      statusCode: 404,
      error: 'Task not found',
    };
  }

  return {
    statusCode: 200,
    data: {
      ...task,
      done: Boolean(task.done),
    },
  };
};

export const createTask = async (payload) => {
  if (
    !payload ||
    !payload.title ||
    typeof payload.title !== 'string' ||
    payload.title.trim() === ''
  ) {
    return {
      statusCode: 400,
      error: 'Invalid title',
    };
  }

  const allowedKeys = ['title'];
  const payloadKeys = Object.keys(payload);
  const extraKeys = payloadKeys.filter((k) => !allowedKeys.includes(k));

  if (extraKeys.length > 0) {
    return {
      statusCode: 400,
      error: 'Only title is allowed in the payload',
    };
  }

  const db = await getDb();

  // Duplicate check
  const duplicate = await db.get(
    'SELECT * FROM tasks WHERE LOWER(title) = LOWER(?)',
    [payload.title.trim()]
  );

  if (duplicate) {
    return {
      statusCode: 400,
      error: 'Task already exists',
    };
  }

  const result = await db.run(
    'INSERT INTO tasks (title, done) VALUES (?, ?)',
    [payload.title.trim(), 0]
  );

  const newTask = await db.get('SELECT * FROM tasks WHERE id = ?', [result.lastID]);

  return {
    statusCode: 201,
    data: {
      ...newTask,
      done: Boolean(newTask.done),
    },
  };
};

export const updateTask = async (id, payload) => {
  if (
    !payload ||
    !payload.title ||
    typeof payload.title !== 'string' ||
    payload.title.trim() === ''
  ) {
    return {
      statusCode: 400,
      error: 'Invalid title',
    };
  }

  if (payload.done === undefined || typeof payload.done !== 'boolean') {
    return {
      statusCode: 400,
      error: 'Invalid done value',
    };
  }

  const db = await getDb();
  const existingTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);

  if (!existingTask) {
    return {
      statusCode: 404,
      error: 'Task not found',
    };
  }

  await db.run('UPDATE tasks SET title = ?, done = ? WHERE id = ?', [
    payload.title.trim(),
    payload.done ? 1 : 0,
    id,
  ]);

  const updatedTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);

  return {
    statusCode: 200,
    data: {
      ...updatedTask,
      done: Boolean(updatedTask.done),
    },
  };
};

export const deleteTask = async (id) => {
  const db = await getDb();
  const existingTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);

  if (!existingTask) {
    return {
      statusCode: 404,
      error: 'Task not found',
    };
  }

  await db.run('DELETE FROM tasks WHERE id = ?', [id]);

  return {
    statusCode: 204,
    message: 'Task deleted successfully',
  };
};

export const getTaskStats = async () => {
  const db = await getDb();
  const stats = await db.get(`
    SELECT 
      COUNT(*) as totalTasks,
      SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completedTasks,
      SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pendingTasks
    FROM tasks
  `);

  return {
    statusCode: 200,
    data: {
      totalTasks: stats.totalTasks || 0,
      completedTasks: stats.completedTasks || 0,
      pendingTasks: stats.pendingTasks || 0,
    },
  };
};
