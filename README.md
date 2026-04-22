# ✦ TaskManager — MERN Task Manager

A full-stack, production-ready Task Manager application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Features secure JWT authentication, full CRUD task management, real-time filtering/searching/sorting, and a statistics dashboard.

---

## 🖼️ Features

- 🔐 **Authentication** — Register, login, and logout with JWT-secured sessions
- ✅ **Task CRUD** — Create, read, update, delete tasks with full ownership control
- 🎯 **Priority Levels** — Low / Medium / High with visual indicators
- 📅 **Due Dates** — Set due dates with overdue detection
- 🔍 **Search & Filter** — Real-time search, filter by status/priority, sort by multiple fields
- 📊 **Statistics Dashboard** — Total, completed, pending, and overdue task counts with completion rate
- 🧹 **Bulk Delete** — Clear all completed tasks at once
- 🔒 **Authorization** — Users can only access their own tasks
- 📱 **Responsive** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js 18, React Router v6        |
| Styling    | Custom CSS with CSS variables       |
| HTTP       | Axios                               |
| Toasts     | react-hot-toast                     |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB with Mongoose               |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Validation | express-validator                   |
| Dev        | nodemon, morgan                     |

---

## 📁 Project Structure

```
TaskManager/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, GetMe
│   │   └── taskController.js      # CRUD + Stats + Filters
│   ├── middleware/
│   │   ├── auth.js                # JWT protect middleware
│   │   ├── validate.js            # express-validator rules
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt hash)
│   │   └── Task.js                # Task schema with virtuals
│   ├── routes/
│   │   ├── auth.js                # /api/auth routes
│   │   └── tasks.js               # /api/tasks routes
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ConfirmDialog.js   # Delete confirmation modal
    │   │   ├── Navbar.js          # Top navigation bar
    │   │   ├── ProtectedRoute.js  # Auth guard component
    │   │   ├── StatsGrid.js       # Statistics cards
    │   │   ├── TaskCard.js        # Individual task card
    │   │   └── TaskModal.js       # Create/edit task modal
    │   ├── context/
    │   │   └── AuthContext.js     # Auth state & actions
    │   ├── hooks/
    │   │   └── useTasks.js        # Tasks state & actions
    │   ├── pages/
    │   │   ├── DashboardPage.js   # Main task dashboard
    │   │   ├── LoginPage.js       # Login form
    │   │   └── RegisterPage.js    # Register form
    │   ├── styles/
    │   │   └── globals.css        # Global design system CSS
    │   ├── utils/
    │   │   └── api.js             # Axios instance + all API calls
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    ├── package.json
    └── vercel.json
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js v18+ and npm
- MongoDB Atlas account (free tier works)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/TaskManager.git
cd TaskManager
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_min_32_characters
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev       # development (nodemon)
npm start         # production
```

The API will be running at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend dev server:
```bash
npm start
```

The app will be running at: `http://localhost:3000`

---

## 🚀 Deployment

### Database — MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user with read/write access
3. Whitelist IP `0.0.0.0/0` (for hosted environments)
4. Copy the connection string to your backend `MONGODB_URI`

---

### Backend — Render
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set **Root Directory** to `backend`
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-frontend.vercel.app`

---

### Frontend — Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add Environment Variable:
   - `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy!

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

#### POST `/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

#### GET `/auth/me` 🔒
Get the currently authenticated user.

**Response `200`:**
```json
{
  "success": true,
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### Task Endpoints (All Protected 🔒)

#### GET `/tasks`
Fetch all tasks for the logged-in user.

**Query Parameters:**

| Parameter | Type   | Values                                          | Description             |
|-----------|--------|-------------------------------------------------|-------------------------|
| `status`  | string | `all`, `pending`, `completed`                  | Filter by status        |
| `priority`| string | `low`, `medium`, `high`                         | Filter by priority      |
| `search`  | string | any text                                        | Search title/description|
| `sortBy`  | string | `createdAt`, `updatedAt`, `dueDate`, `priority` | Sort field              |
| `order`   | string | `asc`, `desc`                                   | Sort direction          |
| `page`    | number | default: `1`                                    | Pagination              |
| `limit`   | number | default: `50`                                   | Results per page        |

**Response `200`:**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "tasks": [ { "_id": "...", "title": "...", ... } ]
}
```

---

#### GET `/tasks/stats`
Get task statistics for the logged-in user.

**Response `200`:**
```json
{
  "success": true,
  "stats": {
    "total": 12,
    "completed": 7,
    "pending": 5,
    "overdue": 2,
    "completionRate": 58,
    "priorityBreakdown": { "low": 3, "medium": 6, "high": 3 }
  }
}
```

---

#### GET `/tasks/:id`
Get a single task by ID.

**Response `200`:**
```json
{
  "success": true,
  "task": { "_id": "...", "title": "...", "priority": "high", ... }
}
```

---

#### POST `/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project report",
  "description": "Include all metrics and graphs",
  "priority": "high",
  "dueDate": "2025-12-31",
  "completed": false
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": { "_id": "...", ... }
}
```

---

#### PUT `/tasks/:id`
Update an existing task (owner only).

**Request Body:** (any subset of task fields)
```json
{
  "title": "Updated title",
  "priority": "medium",
  "completed": true
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": { ... }
}
```

---

#### PATCH `/tasks/:id/toggle`
Toggle the completion status of a task.

**Response `200`:**
```json
{
  "success": true,
  "message": "Task marked as completed",
  "task": { ... }
}
```

---

#### DELETE `/tasks/:id`
Delete a specific task (owner only).

**Response `200`:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

#### DELETE `/tasks/completed`
Delete all completed tasks for the logged-in user.

**Response `200`:**
```json
{
  "success": true,
  "message": "3 completed task(s) deleted",
  "deletedCount": 3
}
```

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens signed with a secret key, expire in 7 days
- Authorization checks on every task mutation (ownership verified)
- Input validation on all endpoints via **express-validator**
- Global error handler prevents stack trace leakage in production
- CORS configured to allow only the frontend origin
- Environment variables for all secrets (never hardcoded)

---

## 🧪 Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

| Status | Meaning                     |
|--------|-----------------------------|
| 400    | Validation / bad input      |
| 401    | Unauthenticated             |
| 403    | Forbidden (not owner)       |
| 404    | Resource not found          |
| 500    | Internal server error       |

---

## 📄 License

MIT — free to use for educational and personal projects.
