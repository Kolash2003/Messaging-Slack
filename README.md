# 💬 Slack Clone — Backend API

A full-featured **Slack-inspired** real-time messaging platform backend built with **Node.js**, **Express**, **MongoDB**, **Socket.IO**, and **BullMQ**. It supports workspace and channel management, JWT-based authentication, real-time messaging via WebSockets, and asynchronous email notifications through a Redis-backed job queue.

---

## ✨ Features

- **User Authentication** — Sign up & sign in with hashed passwords (bcrypt) and JWT tokens
- **Workspace Management** — Create, update, delete workspaces with role-based access control (admin/member)
- **Invite System** — Join workspaces via unique 6-character join codes
- **Channel Management** — Create and manage channels within workspaces (auto-creates a `#general` channel)
- **Real-Time Messaging** — Send and receive messages instantly via Socket.IO with room-based channel isolation
- **Paginated Message History** — Fetch message history with pagination support
- **Email Notifications** — Asynchronous email delivery via BullMQ + Redis when members are added to workspaces
- **Request Validation** — Schema-based input validation using Zod
- **Auto-Generated Avatars** — User avatars via [RoboHash](https://robohash.org/)
- **Job Dashboard** — Bull Board UI for monitoring email queue jobs at `/ui`

---

## 🛠 Tech Stack

| Category           | Technology                                                    |
| ------------------ | ------------------------------------------------------------- |
| **Runtime**        | Node.js (ES Modules)                                          |
| **Framework**      | Express v5                                                    |
| **Database**       | MongoDB via Mongoose v9                                       |
| **Real-Time**      | Socket.IO v4                                                  |
| **Authentication** | JSON Web Tokens (jsonwebtoken) + bcrypt                       |
| **Validation**     | Zod v4                                                        |
| **Job Queue**      | BullMQ + Redis (via ioredis)                                  |
| **Email**          | Nodemailer (Gmail SMTP)                                       |
| **Queue Dashboard**| Bull Board (@bull-board/express)                              |
| **Linting**        | ESLint v9 + eslint-plugin-simple-import-sort                  |
| **Formatting**     | Prettier                                                      |
| **Dev Server**     | Nodemon                                                       |

---

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Kolash2003/Messaging-Slack.git
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root (see [Environment Variables](#-environment-variables) below).

4. **Start MongoDB and Redis**

   Make sure both MongoDB and Redis are running locally (or update the `.env` with remote connection strings).

   ```bash
   # MongoDB (default port 27017)
   mongod

   # Redis (default port 6379)
   redis-server
   ```

5. **Start the development server**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000` (or the port specified in `.env`).

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable         | Description                          | Example                              |
| ---------------- | ------------------------------------ | ------------------------------------ |
| `PORT`           | Server port                          | `3000`                               |
| `DEV_DB_URL`     | MongoDB connection string (dev)      | `mongodb://127.0.0.1:27017/slack`    |
| `PROD_DB_URL`    | MongoDB connection string (prod)     | `mongodb+srv://...`                  |
| `NODE_ENV`       | Environment mode                     | `development` or `production`        |
| `JWT_SECRET`     | Secret key for JWT signing           | `your-secret-key`                    |
| `EXPIRES_IN`     | JWT token expiry duration            | `1d`                                 |
| `EMAIL_USER`     | Gmail address for sending emails     | `your-email@gmail.com`               |
| `EMAIL_PASSWORD` | Gmail app password                   | `xxxx xxxx xxxx xxxx`                |
| `REDIS_HOST`     | Redis server host                    | `localhost`                           |
| `REDIS_PORT`     | Redis server port                    | `6379`                               |

> **Note**: For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) (requires 2FA to be enabled on your Google account).

---

## 📜 Available Scripts

| Command           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `npm start`       | Runs ESLint fix, then starts the dev server with Nodemon |
| `npm run format`  | Formats the entire codebase with Prettier            |
| `npm run lint`    | Runs ESLint checks                                   |
| `npm run lint:fix`| Runs ESLint with auto-fix                            |

---