# VyomXpress Backend

Production-grade REST API backend built with Node.js, Express.js, MySQL, Sequelize ORM, JWT Authentication, and Discord Bot integration.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL + Sequelize ORM |
| Auth | JWT + bcrypt |
| Discord | discord.js v14 |
| Docs | Swagger / OpenAPI 3.0 |
| Logging | Winston |
| Security | Helmet, express-rate-limit |

---

## Project Structure

```
vyomxpress/
├── src/
│   ├── config/
│   │   ├── database.js       # Sequelize connection
│   │   ├── logger.js         # Winston logger
│   │   └── swagger.js        # Swagger config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── serviceController.js
│   ├── discord/
│   │   ├── bot.js            # Bot + slash command handlers
│   │   └── registerCommands.js
│   ├── middleware/
│   │   ├── auth.js           # JWT middleware
│   │   ├── validate.js       # express-validator
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── services.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── response.js
│   └── index.js              # Express app entry
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vyomxpress-backend.git
cd vyomxpress-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=vyomxpress
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_client_id
DISCORD_GUILD_ID=your_discord_server_guild_id
```

### 4. Create MySQL Database

```sql
CREATE DATABASE vyomxpress;
```

### 5. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will auto-sync all Sequelize models on startup.

---

## Discord Bot Setup

### 1. Create a Discord Application
1. Go to https://discord.com/developers/applications
2. Click **New Application** → give it a name
3. Go to **Bot** → click **Add Bot**
4. Copy the **Token** → paste into `DISCORD_TOKEN` in `.env`
5. Go to **OAuth2 → General** → copy the **Client ID** → paste into `DISCORD_CLIENT_ID`

### 2. Get Your Guild ID
- Enable **Developer Mode** in Discord settings
- Right-click your server → **Copy Server ID** → paste into `DISCORD_GUILD_ID`

### 3. Invite Bot to Server
Go to OAuth2 → URL Generator → select scopes: `bot`, `applications.commands`
Bot permissions: `Send Messages`, `Use Slash Commands`

### 4. Register Slash Commands

```bash
npm run register-commands
```

### 5. Start the Bot

```bash
npm run bot
```

---

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, returns JWT |
| GET | `/auth/me` | ✅ | Get current user profile |

### Users

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users` | ✅ | Admin | Get all users |
| GET | `/users/:id` | ✅ | Any | Get user by ID |
| GET | `/users/username/:username` | ✅ | Any | Get user by username |

### Services

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/services` | ✅ | Create service |
| GET | `/services` | ✅ | Get all services |
| GET | `/services/:id` | ✅ | Get service by ID |

---

## Discord Slash Commands

| Command | Options | Description |
|---------|---------|-------------|
| `/ppcreateuser` | `username`, `email`, `password` | Create a new user |
| `/ppcreateservice` | `name`, `description?`, `status?` | Create a new service |
| `/ppgetuser` | `username` | Look up a user by username |

---

## Swagger Documentation

Once running, visit:
```
http://localhost:5000/api-docs
```

---

## Security Features

- **Helmet.js** — Sets secure HTTP headers
- **bcrypt** — Password hashing with salt rounds of 12
- **JWT** — Stateless authentication
- **Rate Limiting** — 100 req/15min globally, 10 req/15min on auth routes
- **Input Validation** — express-validator on all inputs
- **Soft Deletes** — Sequelize `paranoid: true` on all models
- **Duplicate Detection** — Username + email uniqueness enforced at DB level

---

## Health Check

```
GET /health
```

---

## Deployment

### Railway / Render / Fly.io
1. Push to GitHub
2. Connect repo in the platform dashboard
3. Set all environment variables from `.env.example`
4. Deploy

---

## Postman Collection

Import the file `docs/VyomXpress.postman_collection.json` into Postman, or use Swagger at `/api-docs`.
