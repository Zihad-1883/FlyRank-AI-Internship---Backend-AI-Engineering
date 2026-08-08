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

};

export const createTask = async (payload) => {

};

export const updateTask = async (id, payload) => {

};

export const deleteTask = async (id) => {

};

export const getTaskStats = async () => {

};

