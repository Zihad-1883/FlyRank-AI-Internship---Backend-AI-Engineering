import { getDb } from "../db/database.js";

export const getAllTasks = async (query = {}) => {
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

  const tasks = (rows || []).map((task) => ({
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
  const sql = 'SELECT * FROM tasks WHERE id = ?';
  const task = await db.get(sql, [id]);
  if (!task) {
    return {
      statusCode: 404,
      message: 'Task not found',
    };
  }
  return {
    statusCode: 200,
    data: {
      ...task,
      done: Boolean(task.done),
    },
  }
};

export const createTask = async (payload) => {
  const db = await getDb();
  const { title } = payload;
  if (!title) {
    return {
      statusCode: 400,
      message: "Title is required",
    };
  }
  const duplicateTask = await db.get('SELECT * FROM tasks WHERE title = ?', [title]);
  if (duplicateTask) {
    return {
      statusCode: 400,
      message: "Task already exists",
    };
  }
  const sql = 'INSERT INTO tasks (title) VALUES (?)';
  const result = await db.run(sql, [title]);
  return {
    statusCode: 201,
    data: {
      id: result.lastID,
      title,
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateTask = async (id, payload) => {
  const { title, done } = payload;
  const db = await getDb();

  if (title && typeof title !== 'string' || title.trim() === '') {
    return {
      statusCode: 400,
      message: "Invalid title",
    };
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return {
      statusCode: 400,
      message: "Invalid done value",
    };
  }

  const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
  if (!task) {
    return {
      statusCode: 404,
      message: "Task not found",
    };
  }

  const sql = 'UPDATE tasks SET title = ?, done = ?, updated_at = ? WHERE id = ?';
  const result = await db.run(sql, [title, done, new Date().toISOString(), id]);
  return {
    statusCode: 200,
    data: {
      ...task,
      title,
      done,
      updated_at: new Date().toISOString(),
    },
  };
};

export const deleteTask = async (id) => {
  const db = await getDb();
  const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
  if (!task) {
    return {
      statusCode: 404,
      message: "Task not found",
    };
  }
  const sql = 'DELETE FROM tasks WHERE id = ?';
  await db.run(sql, [id]);
  return {
    statusCode: 204,
    message: "Task deleted successfully",
  };
};

export const getTaskStats = async () => {
  const db = await getDb();
  const sql = 'SELECT COUNT(*) as count FROM tasks';
  const result = await db.get(sql);
  return {
    statusCode: 200,
    data: result,
  };
};

