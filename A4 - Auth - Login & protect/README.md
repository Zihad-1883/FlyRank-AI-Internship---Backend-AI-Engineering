# FlyRank Auth API — Login & Protect (Assignment A4)

A secure backend API built with **Express.js** and **Supabase Auth** as the Identity Provider. This project implements user authentication (Sign Up, Log In, Log Out), token-based JWT protection via reusable middleware, interactive API documentation using **Swagger UI**, and strict security patterns.

---

## 🚀 Features

- **Sign Up (`POST /auth/signup`)**: Creates new user accounts using Supabase Auth.
- **Log In (`POST /auth/login`)**: Authenticates user credentials and returns JWT `access_token` and `refresh_token`.
- **Log Out (`POST /auth/logout`)**: Protected endpoint that signs out the user and revokes sessions, returning `204 No Content`.
- **Protected Routes (`GET /protected/profile`, `GET /protected/dashboard`)**: Protected by a reusable `tokenVerifier` middleware that validates `Authorization: Bearer <token>` against Supabase Auth.
- **Public Route (`GET /public/info`)**: Unprotected endpoint accessible to all clients.
- **Swagger UI Interactive Docs**: Served at `/docs` and `/api-docs` with `bearerAuth` integration.

---

## 📋 API Reference Table

| Method | Endpoint | Description | Auth Required | Status Code (Success) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Create a new user account | No | `201 Created` |
| `POST` | `/auth/login` | Authenticate user & return JWT tokens | No | `200 OK` |
| `POST` | `/auth/logout` | End current user session | **Yes** (`Bearer JWT`) | `204 No Content` |
| `GET` | `/protected/profile` | Access private user profile data | **Yes** (`Bearer JWT`) | `200 OK` |
| `GET` | `/protected/dashboard` | Access user dashboard stats (middleware reuse) | **Yes** (`Bearer JWT`) | `200 OK` |
| `GET` | `/public/info` | Public open data endpoint | No | `200 OK` |

---

## 🛠️ Setup & Installation Instructions

### 1. Prerequisites
- Node.js (v18+ recommended)
- A free [Supabase](https://supabase.com) account & project

### 2. Environment Configuration
Copy `.env.example` to create a `.env` file in the project root:

```bash
cp .env.example .env
```

Set your Supabase project credentials in `.env`:
```env
SUPABASE_URL=https://your-supabase-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_public_key
PORT=3000
```

> **Note**: Never expose your `service_role` key. Use the public `anon` key.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Server
```bash
npm run dev
```

The server will start at `http://localhost:3000`.

---

## 📖 Interactive Swagger Documentation

Visit **`http://localhost:3000/docs`** (or `/api-docs`) in your browser to access the interactive Swagger UI documentation.

### How to use Bearer Authorization in Swagger UI:
1. Call `POST /auth/login` with your registered credentials.
2. Copy the `access_token` from the response body.
3. Click the **Authorize 🔓** button at the top right of the Swagger UI.
4. Enter your token into the **Value** field and click **Authorize**.
5. Test protected endpoints (`/protected/profile`, `/protected/dashboard`, `/auth/logout`) directly from your browser!

---

## 🧪 Testing with cURL

### 1. Sign Up
```bash
curl -i -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Log In
```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Access Protected Route (Valid Token)
```bash
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 4. Access Protected Route (Invalid Token -> 401)
```bash
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer INVALID_TOKEN"
```

### 5. Log Out
```bash
curl -i -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
# Returns 204 No Content
```
