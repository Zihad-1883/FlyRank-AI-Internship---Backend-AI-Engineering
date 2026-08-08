const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON body
app.use(express.json());

// Handle JSON parsing errors cleanly
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 400, 'Invalid JSON format in request body');
  }
  next(err);
});

// Initial In-Memory Task Data
let tasks = [
  { id: 1, name: 'Learn Express.js', done: true },
  { id: 2, name: 'Build Task Manager API', done: false },
  { id: 3, name: 'Create Swagger UI documentation', done: false }
];
let nextId = 4;

// Helper response functions for structural consistency
const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

// Helper function to validate integer IDs
const parseTaskId = (idParam) => {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
};

// Serve Swagger Documentation UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root Endpoint - Quick Info
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// 1. GET ALL TASKS (with optional search and done filter)
// GET /tasks?search=express&done=true
app.get('/tasks', (req, res) => {
  try {
    const { search, done } = req.query;
    let filteredTasks = [...tasks];

    // Filter by task name search keyword (case-insensitive)
    if (search !== undefined && search !== null) {
      const queryStr = String(search).trim().toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.name.toLowerCase().includes(queryStr)
      );
    }

    // Filter by completed status ('true' or 'false')
    if (done !== undefined && done !== null) {
      const doneLower = String(done).trim().toLowerCase();
      if (doneLower === 'true') {
        filteredTasks = filteredTasks.filter(task => task.done === true);
      } else if (doneLower === 'false') {
        filteredTasks = filteredTasks.filter(task => task.done === false);
      } else {
        return sendError(res, 400, "Invalid value for 'done' query parameter. Must be 'true' or 'false'.");
      }
    }

    return sendSuccess(res, 200, 'Tasks retrieved successfully', filteredTasks);
  } catch (error) {
    return sendError(res, 500, 'Internal server error while retrieving tasks', error.message);
  }
});

// 2. GET SINGLE TASK BY ID
// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
  try {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
      return sendError(res, 400, 'Task ID must be a positive integer');
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      return sendError(res, 404, `Task with ID ${taskId} not found`);
    }

    return sendSuccess(res, 200, 'Task retrieved successfully', task);
  } catch (error) {
    return sendError(res, 500, 'Internal server error while fetching task', error.message);
  }
});

// 3. POST NEW TASK
// POST /tasks
app.post('/tasks', (req, res) => {
  try {
    const { name, done } = req.body;
    const errors = [];

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push("Task 'name' is required and must be a non-empty string.");
    }

    if (done !== undefined && typeof done !== 'boolean') {
      errors.push("Task 'done' field must be a boolean value (true or false).");
    }

    if (errors.length > 0) {
      return sendError(res, 400, 'Validation error', errors);
    }

    const newTask = {
      id: nextId++,
      name: name.trim(),
      done: done === undefined ? false : done
    };

    tasks.push(newTask);

    return sendSuccess(res, 201, 'Task created successfully', newTask);
  } catch (error) {
    return sendError(res, 500, 'Internal server error while creating task', error.message);
  }
});

// 4. EDIT TASK (PUT)
// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  try {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
      return sendError(res, 400, 'Task ID must be a positive integer');
    }

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return sendError(res, 404, `Task with ID ${taskId} not found`);
    }

    const { name, done } = req.body;
    const errors = [];

    if (name === undefined && done === undefined) {
      errors.push("At least one field ('name' or 'done') must be provided for update.");
    }

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      errors.push("Task 'name' must be a non-empty string.");
    }

    if (done !== undefined && typeof done !== 'boolean') {
      errors.push("Task 'done' must be a boolean value (true or false).");
    }

    if (errors.length > 0) {
      return sendError(res, 400, 'Validation error', errors);
    }

    const existingTask = tasks[taskIndex];
    const updatedTask = {
      ...existingTask,
      name: name !== undefined ? name.trim() : existingTask.name,
      done: done !== undefined ? done : existingTask.done
    };

    tasks[taskIndex] = updatedTask;

    return sendSuccess(res, 200, 'Task updated successfully', updatedTask);
  } catch (error) {
    return sendError(res, 500, 'Internal server error while updating task', error.message);
  }
});

// 5. DELETE TASK
// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  try {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
      return sendError(res, 400, 'Task ID must be a positive integer');
    }

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return sendError(res, 404, `Task with ID ${taskId} not found`);
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    return sendSuccess(res, 200, 'Task deleted successfully', deletedTask);
  } catch (error) {
    return sendError(res, 500, 'Internal server error while deleting task', error.message);
  }
});

// 404 Route Not Found Middleware
app.use((req, res) => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  sendError(res, 500, 'An unexpected server error occurred', err.message);
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task Manager API is running on http://localhost:${PORT}`);
    console.log(`Swagger UI Documentation available at http://localhost:${PORT}/docs`);
  });
}

module.exports = app;
