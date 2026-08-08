# FlyRank AI Internship — Assignments Progress Summary

This repository contains the assignments completed for the **FlyRank AI Internship**. The work focuses on building, structuring, documenting, and persisting a RESTful **Task Manager CRUD API** using **Node.js, Express.js, and SQLite**.

---

## 📌 Overview of Completed Assignments

| Assignment | Folder Name | Focus Area | Data Persistence | Module System | Architectural Pattern |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Assignment 1** | `W2 · A1 — Build your first CRUD API` | Building your first CRUD API | In-Memory (`Array`) | CommonJS / ES Modules | Controller-Service-Router + AI comparison |
| **Assignment 2** | `A2 -  Connecting your CRUD to the database` | Connecting CRUD to Database | Persistent (`SQLite`) | ESNext (ES Modules) | Layered Modular Architecture + SQL queries |

---

## 📂 1. Assignment 1 (`W2 · A1 — Build your first CRUD API`)

### 🎯 Objective
Design and implement a RESTful Express.js CRUD API for managing tasks in-memory, complete with search/filtering capabilities, consistent response envelopes, and Swagger UI interactive documentation.

### 🛠️ Key Highlights & Features
- **In-Memory Storage**: Initialized with default tasks in a JavaScript array.
- **Full CRUD Endpoints**:
  - `GET /tasks`: Retrieve all tasks (supports `?done=true|false` and search via `?search=keyword`).
  - `GET /tasks/:id`: Fetch a single task by ID.
  - `POST /tasks`: Create a new task with title validation.
  - `PUT /tasks/:id`: Update existing task title or completion status.
  - `DELETE /tasks/:id`: Remove task by ID.
  - `GET /stats`: Return overall task completion statistics.
- **Interactive Documentation**: Integrated Swagger UI at `/api-docs`.
- **Modular vs AI Comparison**:
  - **Manual Implementation (`/src`)**: Clean Controller-Service-Router architecture for maintainability and separation of concerns.
  - **AI-Generated Implementation (`/ai-version`)**: Single-file solution (`index.js` + `swagger.json`) generated using Gemini 3.6 Flash.
  - **Documented Reflections**: Detailed "AI vs Me" section in `README.md` analyzing AI edge-case handling, response helpers, and structural decisions.

---

## 📂 2. Assignment 2 (`A2 -  Connecting your CRUD to the database`)

### 🎯 Objective
Migrate the Task Manager API from in-memory array storage to a persistent **SQLite database**, transition the codebase to modern **ESNext (ES Modules)**, and implement direct SQL query interactions.

### 🛠️ Key Highlights & Features
- **SQLite Database Integration**:
  - Zero-config, file-based persistence using `./tasks.db`.
  - **Automatic Initialization**: On server startup, the database creates the `tasks` table if it does not exist and seeds initial sample records if empty.
- **Database Schema (`tasks`)**:
  - `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`
  - `title`: `TEXT NOT NULL`
  - `done`: `INTEGER NOT NULL DEFAULT 0`
  - `created_at`: `DATETIME DEFAULT CURRENT_TIMESTAMP`
  - `updated_at`: `DATETIME DEFAULT CURRENT_TIMESTAMP`
- **Staged Step-by-Step Execution**:
  1. **Stage 0**: SQLite database connection (`database.js`) and auto-schema setup.
  2. **Stage 1**: Implemented DB read operations (`GET /tasks` with filtering & `GET /tasks/:id`).
  3. **Stage 2**: Implemented DB insertion (`POST /tasks`).
  4. **Stage 3**: Implemented DB updates & deletions (`PUT /tasks/:id` with dynamic field updates and timestamping, `DELETE /tasks/:id`).
  5. **Stage 4 & 5**: Database exploration script (`explore_sql.sql`) and visual inspection documentation via SQLite Viewer extension screenshot (`sqlite_viewer.png`).

---

## 📊 Summary of API Endpoints (Assignment 2)

| Method | Endpoint | Description | Query / Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root API Metadata | None |
| `GET` | `/health` | Server Health Status | None |
| `GET` | `/api-docs` | Swagger UI Interactive Docs | None |
| `GET` | `/tasks` | Get all tasks | `?done=true\|false`, `?search=keyword` |
| `GET` | `/tasks/:id` | Get task by ID | Path parameter `id` |
| `POST` | `/tasks` | Create task | Body: `{ "title": "Task description" }` |
| `PUT` | `/tasks/:id` | Update task | Body: `{ "title": "New Title", "done": true }` |
| `DELETE` | `/tasks/:id` | Delete task | Path parameter `id` |
| `GET` | `/stats` | Task statistics | None |

---

## 🗂️ Project Directory Map

```
Assignments/
├── PROGRESS_SUMMARY.md                           # Overall assignments progress summary
├── W2 · A1 — Build your first CRUD API/          # Assignment 1: In-Memory Express CRUD API
│   ├── ai-version/                               # AI Single-file implementation & Swagger
│   ├── src/                                      # Modular Controller-Service-Router codebase
│   │   ├── index.js
│   │   └── tasks/                                # Route, controller, service, swagger.json
│   ├── README.md                                 # Documentation & AI vs Human evaluation
│   └── swagger-screenshot.png
└── A2 -  Connecting your CRUD to the database/   # Assignment 2: Persistent SQLite CRUD API
    ├── docs/
    │   └── sqlite_viewer.png                     # Database viewer verification screenshot
    ├── src/
    │   ├── db/
    │   │   └── database.js                       # SQLite connection & table auto-init
    │   ├── tasks/
    │   │   ├── explore_sql.sql                   # SQL exploration queries
    │   │   ├── tasks.controller.js
    │   │   ├── tasks.route.js
    │   │   ├── tasks.service.js                  # SQL-backed business logic
    │   │   └── swagger.json
    │   └── index.js                              # Server entry point
    ├── tasks.db                                  # SQLite database file
    └── README.md                                 # Database setup & exploration guide
```

---

## ✅ Progress Status

Both **Assignment 1** (`W2 · A1`) and **Assignment 2** (`A2`) are **100% complete**, fully tested, documented, and verified with Git history and visual documentation.
