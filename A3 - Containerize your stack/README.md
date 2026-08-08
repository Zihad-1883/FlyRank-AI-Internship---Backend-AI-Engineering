# Assignment 3: Containerize Your Stack (Task Manager API)

A production-ready, containerized **Task Manager RESTful CRUD API** built with **Node.js (ESNext / Express 5)** and **PostgreSQL 16**, fully orchestrated with **Docker Compose**.

---

## 🚀 One-Command Run

Start the entire application stack (Node.js API + PostgreSQL database) with a single command:

```bash
docker compose up --build
```

To run in background (detached mode):

```bash
docker compose up -d --build
```

To stop the stack:

```bash
docker compose down
```

> **Note**: Data persists across `docker compose down` and `docker compose up` via the mounted PostgreSQL volume (`taskdata`).

---

## 🛠️ Environment Configuration

The application reads database configuration via environment variables:

- **`.env`** *(git-ignored for security)*:
  ```env
  DATABASE_URL=postgres://postgres:dev@db:5432/tasks
  ```
- **`.env.example`** *(committed)*:
  ```env
  DATABASE_URL=postgres://postgres:dev@YOUR_PASSWORD@localhost:5432/tasks
  ```

---

## 📌 API Endpoint Reference Table

| Method | Endpoint | Description | Query / Request Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API Root Metadata | None | `200 OK` |
| `GET` | `/health` | Container & Service Health Check | None | `200 OK` |
| `GET` | `/api-docs` | Swagger UI Interactive Docs | None | `200 OK` |
| `GET` | `/tasks` | Retrieve all tasks | `?done=true\|false`, `?search=keyword` | `200 OK` |
| `GET` | `/tasks/:id` | Get single task by ID | Path parameter `id` | `200 OK`, `404 Not Found` |
| `POST` | `/tasks` | Create a new task | Body: `{ "title": "Task title" }` | `201 Created`, `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update title or completion status | Body: `{ "title": "Updated", "done": true }` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/tasks/:id` | Remove a task by ID | Path parameter `id` | `204 No Content`, `404 Not Found` |
| `GET` | `/stats` | Aggregate task statistics | None | `200 OK` |

---

## 🧪 Sample `curl -i` Output

Below is an actual sample output when executing `curl -i http://localhost:3000/tasks`:

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 407
ETag: W/"197-eD6nLz18M5rZ917B9p3b4F6w/0M"
Date: Sat, 08 Aug 2026 17:54:35 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "title": "Finish the project",
      "done": false,
      "createdAt": "2026-08-08T17:47:29.223Z",
      "updatedAt": "2026-08-08T17:47:29.223Z"
    },
    {
      "id": 2,
      "title": "Write documentation",
      "done": false,
      "createdAt": "2026-08-08T17:47:29.223Z",
      "updatedAt": "2026-08-08T17:47:29.223Z"
    },
    {
      "id": 3,
      "title": "Deploy to production",
      "done": false,
      "createdAt": "2026-08-08T17:47:29.223Z",
      "updatedAt": "2026-08-08T17:47:29.223Z"
    },
    {
      "id": 4,
      "title": "Test Docker Volume Persistence",
      "done": false,
      "createdAt": "2026-08-08T17:47:48.147Z",
      "updatedAt": "2026-08-08T17:47:48.147Z"
    }
  ]
}
```

---

## 🗄️ Database Verification (PostgreSQL Container Output)

Inspecting database records directly inside the running `db` container via `psql`:

```bash
docker exec -it a3-containerizeyourstack-db-1 psql -U postgres -d tasks -c "SELECT id, title, done, created_at FROM tasks;"
```

### Output:

```
 id |             title              | done |         created_at         
----+--------------------------------+------+----------------------------
  1 | Finish the project             | f    | 2026-08-08 17:47:29.223209
  2 | Write documentation            | f    | 2026-08-08 17:47:29.223209
  3 | Deploy to production           | f    | 2026-08-08 17:47:29.223209
  4 | Test Docker Volume Persistence | f    | 2026-08-08 17:47:48.147925
(4 rows)
```

---

## 📜 Features & Highlights

- **Single Command Orchestration**: Containerized API (`api`) and Database (`db`) connected via Docker internal network (`db:5432`).
- **Data Persistence**: Uses named volume `taskdata` mapped to `/var/lib/postgresql/data`.
- **Automatic Schema Initialization & Seeding**: Table creation and initial 3 sample tasks seeded automatically on first boot.
- **Parameterized SQL Queries**: Fully prevents SQL injection using standard `$1, $2` parameterized queries.
- **Interactive Swagger Documentation**: Accessible at `http://localhost:3000/api-docs`.
