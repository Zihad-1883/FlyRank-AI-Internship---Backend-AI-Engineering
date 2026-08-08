# Task Manager CRUD API with Express (ESNext) & SQLite

This project is a persistent, database-backed RESTful CRUD API built with Express.js (ESNext) and SQLite. It provides complete task management capabilities with automatic database initialization, SQL query support, and interactive API documentation.

---

## 💡 Why SQLite Was Chosen

- **Zero Configuration**: SQLite is a self-contained, serverless database engine that requires no external setup, installation of background database servers, or environment configuration.
- **File-Based Persistence**: Data is stored directly in a single local file (`tasks.db`), making development, testing, and debugging simple and portable across operating systems.
- **Lightweight & Fast**: Ideal for small-to-medium REST APIs, prototyping, and local development with low memory overhead.
- **ACID Compliant**: Provides full transactional guarantees and standard SQL query support.

---

## 💾 Database Details & Storage Location

- **File Path**: `./tasks.db` (Located at `A2 -  Connecting your CRUD to the database/tasks.db`)
- **Auto-Initialization**: The application automatically creates the `tasks.db` file, executes schema creation (`CREATE TABLE IF NOT EXISTS tasks`), and seeds default data on server startup if the table is empty.

### Database Schema (`tasks`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for each task |
| `title` | `TEXT` | `NOT NULL` | Title/description of the task |
| `done` | `INTEGER` | `NOT NULL DEFAULT 0` | Completion status (`0` = pending, `1` = completed) |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp when the task was created |
| `updated_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp when the task was last updated |

---

## 🚀 How to Start the Project

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd "Assignment-1/A2 -  Connecting your CRUD to the database"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Server
- **Development Mode** (with hot reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

> ⚡ **Checkpoint Verified**: Upon running `npm run dev`, the server will automatically create `tasks.db`, set up the schema, seed initial records, and start listening at `http://localhost:3000`.

---

## 🖥️ Database Viewer & Exploration

You can open and inspect `tasks.db` using any SQLite viewer (such as [SQLiteOnline](https://sqliteonline.com/), DB Browser for SQLite, or the VS Code *SQLite Viewer* extension).

### Database Viewer Screenshot
![Database Viewer Screenshot](https://raw.githubusercontent.com/Zihad-1883/FlyRank-AI-Internship---W2-A1-Build-your-first-CRUD-API/main/A2%20-%20%20Connecting%20your%20CRUD%20to%20the%20database/docs/sqlite_viewer_screenshot.png)

*(Note: The viewer shows loaded table `tasks` with columns `id`, `title`, `done`, `created_at`, `updated_at` and query history).*

---

## 🔍 Example Executed SQL Queries

Here are sample SQL queries executed against the database:

```sql
-- 1. List all tasks
SELECT * FROM tasks;

-- 2. Show only completed tasks
SELECT * FROM tasks WHERE done = 1;

-- 3. Count total number of tasks
SELECT COUNT(*) FROM tasks;

-- 4. Mark all tasks as completed
UPDATE tasks SET done = 1;

-- 5. Delete completed tasks
DELETE FROM tasks WHERE done = 1;
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root API information |
| `GET` | `/health` | Health Check endpoint |
| `GET` | `/api-docs` | Interactive Swagger UI Documentation |
| `GET` | `/tasks` | Get all tasks (Supports `?done=true/false` & `?search=keyword`) |
| `GET` | `/tasks/:id` | Get single task by ID |
| `POST` | `/tasks` | Create a new task (`{ "title": "My Task" }`) |
| `PUT` | `/tasks/:id` | Update task (`{ "title": "Updated Title", "done": true }`) |
| `DELETE` | `/tasks/:id` | Delete task by ID |
| `GET` | `/stats` | Get task statistics (total count) |

---

## 🧪 Sample cURL Request

```bash
# Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Explore SQLite Database"}'

# Get completed tasks
curl "http://localhost:3000/tasks?done=true"
```
