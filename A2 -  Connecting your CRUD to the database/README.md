# Task Manager CRUD API with Express (ESNext) & SQLite

This project is the database-backed version of the Task Manager CRUD API built for Assignment A2. It uses modern **ESNext (ES Modules)** syntax (`import`/`export`) and persists data in a lightweight **SQLite** database.

---

## 🛠️ Features & Tech Stack

- **Framework**: Express.js (v5)
- **Module System**: ESNext / ES Modules (`"type": "module"`)
- **Database**: SQLite (via `sqlite3` and `sqlite` promise driver)
- **API Documentation**: Interactive Swagger UI at `/api-docs`
- **Features**:
  - Full CRUD for tasks (Create, Read, Read Single, Update, Delete)
  - Filtering by status (`?done=true` / `?done=false`)
  - Search by title keyword (`?search=query`)
  - Task statistics endpoint (`/stats`)
  - Automatic DB schema creation & initial data seeding on startup

---

## 📁 Directory Structure

```text
A2 -  Connecting your CRUD to the database/
├── database.sqlite       # SQLite database file (auto-created)
├── package.json          # ESNext module configuration
├── README.md
└── src/
    ├── index.js          # Express app entry point (ESNext)
    ├── db/
    │   └── database.js   # SQLite connection & schema initialization
    └── tasks/
        ├── swagger.json          # OpenAPI 3.0 specification
        ├── tasks.controller.js   # Request handlers
        ├── tasks.route.js        # Express routes
        └── tasks.service.js     # SQLite database service queries
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application
- **Development Mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

The server will start at `http://localhost:3000`.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Information |
| `GET` | `/health` | Health Check |
| `GET` | `/api-docs` | Interactive Swagger Documentation |
| `GET` | `/tasks` | Get all tasks (Supports `?done=true/false` & `?search=title`) |
| `GET` | `/tasks/:id` | Get single task details by ID |
| `POST` | `/tasks` | Create a new task (`{ "title": "New Task" }`) |
| `PUT` | `/tasks/:id` | Update a task (`{ "title": "Updated Title", "done": true }`) |
| `DELETE` | `/tasks/:id` | Delete a task by ID |
| `GET` | `/stats` | Get task statistics (total, completed, pending) |

---

## 🧪 Sample Request (cURL)

```bash
# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete SQLite Integration"}'

# Get all completed tasks
curl http://localhost:3000/tasks?done=true
```
