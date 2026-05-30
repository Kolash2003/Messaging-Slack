# 💬 Slack Clone — Backend API

A full-featured **Slack-inspired** real-time messaging platform backend built with **Node.js**, **Express**, **MongoDB**, **Socket.IO**, and **BullMQ**. It supports workspace and channel management, JWT-based authentication, real-time messaging via WebSockets, and asynchronous email notifications through a Redis-backed job queue.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Data Models](#-data-models)
- [API Endpoints](#-api-endpoints)
- [WebSocket Events](#-websocket-events)
- [Email Queue System](#-email-queue-system)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Code Quality](#-code-quality)

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

## 🏗 Architecture

The application follows a **layered architecture** with clear separation of concerns:

```
Client Request
      │
      ▼
┌─────────────┐
│   Routes    │  ← Defines HTTP endpoints & applies middlewares
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middlewares  │  ← Auth (JWT verification), Validation (Zod)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  ← Handles request/response, delegates to services
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  ← Business logic, authorization checks
└──────┬──────┘
       │
       ▼
┌──────────────┐
│ Repositories │  ← Data access layer (Mongoose queries)
└──────┬───────┘
       │
       ▼
┌─────────────┐
│   Schemas   │  ← Mongoose model definitions
└─────────────┘
```

**Real-time communication** is handled separately via Socket.IO socket controllers that bypass the REST layer.

**Async email** is processed through a producer → queue → worker pipeline using BullMQ.

---

## 📁 Project Structure

```
backend/
├── .env                          # Environment variables (not committed)
├── .gitignore
├── .prettierrc                   # Prettier config
├── eslint.config.js              # ESLint config
├── package.json
└── src/
    ├── index.js                  # App entry point — Express + Socket.IO server
    │
    ├── config/
    │   ├── serverConfig.js       # Environment variable exports
    │   ├── dbConfig.js           # MongoDB connection (dev/prod)
    │   ├── redisConfig.js        # Redis connection config
    │   ├── mailConfig.js         # Nodemailer transporter (Gmail SMTP)
    │   └── bullBoardConfig.js    # Bull Board dashboard setup
    │
    ├── routes/
    │   ├── apiRoutes.js          # Mounts /api/v1 router
    │   └── v1/
    │       ├── v1Router.js       # Aggregates all v1 resource routers
    │       ├── users.js          # POST /signup, /signin
    │       ├── workspace.js      # Workspace CRUD + member/channel management
    │       ├── channel.js        # GET channel by ID
    │       ├── member.js         # GET membership verification
    │       └── messages.js       # GET paginated messages
    │
    ├── controllers/
    │   ├── userController.js     # Sign up / sign in handlers
    │   ├── workspaceController.js# Workspace CRUD + add members/channels
    │   ├── channelController.js  # Get channel by ID handler
    │   ├── memberController.js   # Workspace membership check handler
    │   ├── messageController.js  # Get messages handler
    │   ├── channelSocketController.js  # Socket: join channel room
    │   └── messageSocketController.js  # Socket: create & broadcast messages
    │
    ├── services/
    │   ├── userService.js        # User registration & login logic
    │   ├── workspaceService.js   # Workspace business logic & authorization
    │   ├── channelService.js     # Channel retrieval with workspace auth
    │   ├── memberService.js      # Member verification service
    │   └── messageService.js     # Message CRUD + authorization
    │
    ├── repositories/
    │   ├── crudRepositories.js   # Generic CRUD factory (create, getAll, getById, update, delete, deleteMany)
    │   ├── userRepository.js     # User queries (by email, username)
    │   ├── workspaceRepository.js# Workspace queries (by join code, member, + add member/channel)
    │   ├── channelRepository.js  # Channel queries (with workspace population)
    │   └── messageRepository.js  # Paginated message queries
    │
    ├── schema/
    │   ├── users.js              # User model (email, password, username, avatar)
    │   ├── workspace.js          # Workspace model (name, members, channels, joinCode)
    │   ├── channel.js            # Channel model (name, workspace ref)
    │   └── messageSchema.js      # Message model (body, image, channelId, senderId, workspaceId)
    │
    ├── middlewares/
    │   └── authMiddlewares.js    # JWT authentication middleware
    │
    ├── validators/
    │   ├── userSchema.js         # Zod schemas for signup/signin
    │   ├── workspace.js          # Zod schemas for workspace operations
    │   └── zodValidator.js       # Generic Zod validation middleware factory
    │
    ├── queues/
    │   ├── mailQueue.js          # BullMQ mail queue instance
    │   └── testQueue.js          # BullMQ test queue instance
    │
    ├── producer/
    │   └── mailQueueProducer.js  # Adds email jobs to the mail queue
    │
    ├── processor/
    │   └── mailProcessor.js      # BullMQ worker — processes & sends emails
    │
    └── utils/
        ├── common/
        │   ├── authUtils.js      # JWT creation helper
        │   ├── eventConstants.js # Socket.IO event name constants
        │   ├── mailObject.js     # Email template builder
        │   └── responseObjects.js# Standardized API response formatters
        └── errors/
            ├── clientError.js    # Custom ClientError class
            └── validationError.js# Custom ValidationError class
```

---

## 📊 Data Models

### User

| Field      | Type     | Details                              |
| ---------- | -------- | ------------------------------------ |
| `email`    | String   | Required, unique, validated via regex |
| `password` | String   | Required, auto-hashed via bcrypt pre-save hook |
| `username` | String   | Required, unique, alphanumeric only   |
| `avatar`   | String   | Auto-generated via RoboHash           |

### Workspace

| Field         | Type              | Details                                      |
| ------------- | ----------------- | -------------------------------------------- |
| `name`        | String            | Required, unique                              |
| `description` | String            | Optional                                      |
| `members`     | Array of Objects  | `{ memberId: ObjectId (User ref), role: 'admin' \| 'member' }` |
| `joinCode`    | String            | Required, auto-generated 6-char UUID prefix   |
| `channels`    | Array of ObjectId | References to Channel documents               |

### Channel

| Field       | Type     | Details                       |
| ----------- | -------- | ----------------------------- |
| `name`      | String   | Required                       |
| `workspace` | ObjectId | Required, references Workspace |

### Message

| Field         | Type     | Details                        |
| ------------- | -------- | ------------------------------ |
| `body`        | String   | Required                        |
| `image`       | String   | Optional                        |
| `channelId`   | ObjectId | Required, references Channel    |
| `senderId`    | ObjectId | Required, references User       |
| `workspaceId` | ObjectId | Required, references Workspace  |

---

## 🔌 API Endpoints

All REST endpoints are prefixed with `/api/v1`.

### Health Check

| Method | Endpoint | Description        |
| ------ | -------- | ------------------ |
| `GET`  | `/ping`  | Returns `{ message: "pong" }` |

### Authentication

| Method | Endpoint             | Body                               | Auth | Description            |
| ------ | -------------------- | ---------------------------------- | ---- | ---------------------- |
| `POST` | `/api/v1/users/signup` | `{ email, username, password }`   | ❌   | Register a new user    |
| `POST` | `/api/v1/users/signin` | `{ email, password }`             | ❌   | Login & receive JWT    |

### Workspaces

| Method   | Endpoint                                | Body / Params                        | Auth | Description                     |
| -------- | --------------------------------------- | ------------------------------------ | ---- | ------------------------------- |
| `POST`   | `/api/v1/workspace`                     | `{ name, description? }`            | ✅   | Create workspace (you become admin) |
| `GET`    | `/api/v1/workspace`                     | —                                    | ✅   | List all workspaces you're a member of |
| `GET`    | `/api/v1/workspace/:workspaceId`        | —                                    | ✅   | Get workspace details (members only) |
| `GET`    | `/api/v1/workspace/join/:joinCode`      | —                                    | ✅   | Get workspace by join code      |
| `PUT`    | `/api/v1/workspace/:workspaceId`        | `{ name?, description? }`           | ✅   | Update workspace (admin only)   |
| `DELETE` | `/api/v1/workspace/:workspaceId`        | —                                    | ✅   | Delete workspace (admin only)   |
| `PUT`    | `/api/v1/workspace/:workspaceId/members`| `{ memberId, role? }`               | ✅   | Add member to workspace (admin only) |
| `PUT`    | `/api/v1/workspace/:workspaceId/channels`| `{ channelName }`                  | ✅   | Add channel to workspace (admin only) |

### Channels

| Method | Endpoint                         | Auth | Description                          |
| ------ | -------------------------------- | ---- | ------------------------------------ |
| `GET`  | `/api/v1/channel/:channelId`     | ✅   | Get channel details + recent messages (workspace members only) |

### Members

| Method | Endpoint                                   | Auth | Description                        |
| ------ | ------------------------------------------ | ---- | ---------------------------------- |
| `GET`  | `/api/v1/member/workspace/:workspaceId`    | ✅   | Check if authenticated user is a member of the workspace |

### Authentication Header

All authenticated endpoints require the JWT token in the request header:

```
x-access-token: <your_jwt_token>
```

### Response Format

All API responses follow a consistent structure:

```json
// Success
{
  "success": true,
  "message": "Description of the result",
  "data": { ... },
  "err": {}
}

// Error
{
  "success": false,
  "message": "Error description",
  "data": {},
  "err": ["Detailed explanation"]
}
```

---

## 🔄 WebSocket Events

Real-time messaging is powered by **Socket.IO**. Clients connect to the WebSocket server on the same port as the HTTP server.

### Events

| Event Name            | Direction       | Payload                                             | Description                          |
| --------------------- | --------------- | --------------------------------------------------- | ------------------------------------ |
| `joinChannel`         | Client → Server | `{ channelId }`                                     | Join a channel room                  |
| `newMessage`          | Client → Server | `{ body, channelId, senderId, workspaceId, image? }` | Send a message to a channel          |
| `newMessageReceived`  | Server → Client | `{ message object }`                                | Broadcasted to all room members when a new message arrives |

### Flow

1. Client connects to the Socket.IO server
2. Client emits `joinChannel` with the target `channelId` to join the room
3. Client emits `newMessage` with message data
4. Server persists the message to MongoDB
5. Server broadcasts `newMessageReceived` to all clients in the channel room

---

## 📧 Email Queue System

The application uses **BullMQ** with **Redis** for asynchronous email processing.

```
Trigger (e.g., member added to workspace)
      │
      ▼
┌──────────────┐    ┌────────────┐    ┌───────────────┐
│   Producer   │───▶│ Mail Queue │───▶│    Worker      │
│ (adds job)   │    │  (Redis)   │    │ (sends email)  │
└──────────────┘    └────────────┘    └───────────────┘
                                              │
                                              ▼
                                     ┌────────────────┐
                                     │  Gmail SMTP    │
                                     │ (Nodemailer)   │
                                     └────────────────┘
```

- **Queue Dashboard**: Visit `/ui` in the browser to monitor job statuses via Bull Board

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or remote instance)
- **Redis** (local or remote instance)
- **Gmail App Password** (for email notifications)

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

## 🧹 Code Quality

### ESLint

Configured with `@eslint/js` recommended rules and `eslint-plugin-simple-import-sort` for consistent import ordering.

### Prettier

Configured with:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80,
  "trailingComma": "none"
}
```

---

## 📄 License

ISC
