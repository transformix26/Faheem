# API Documentation

This document lists all the API endpoints used in the Faheem application, categorized by functionality. All existing endpoints are Next.js API routes, while future data endpoints will be implemented in a Node.js backend.

## Authentication (Next.js API)
Endpoints located in `/app/api/auth/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authenticates user and sets session cookies. |
| `/api/auth/register` | POST | Creates a new user account. |
| `/api/auth/logout` | POST | Clears session cookies. |
| `/api/auth/refresh` | POST | Refreshes the access token using rotation. |
| `/api/auth/onboarding` | POST | Saves initial user preferences and company data. |

## Dashboard & Bot Management (Future Node.js)
These endpoints will be migrated or created to handle dynamic data per bot.

### Bots
- `GET /api/bots`: Fetch all bots for the user.
- `POST /api/bots`: Create a new bot.
- `PATCH /api/bots/:id`: Update bot settings (name, status, autoReply, collectLeads, handoffEnabled).
- `DELETE /api/bots/:id`: Remove a bot.

### Knowledge Base (Bot Specific)
- `GET /api/knowledge?botId=:id`: Fetch all knowledge items for a bot.
- `POST /api/knowledge`: Add manual text, product data, or upload files.
- `DELETE /api/knowledge/:id`: Remove a knowledge item.

### Channels (Bot Specific)
- `GET /api/channels?botId=:id`: Fetch connected channels for a bot.
- `POST /api/channels/connect`: Link a new platform (WhatsApp, FB, etc.).
- `POST /api/channels/disconnect`: Unlink a platform.

## Profile (In-Memory/Local Storage for now)
- Currently handled via `auth-context.tsx` and persistence in `localStorage`.
- Future: `PATCH /api/user/profile` to update user details in DB.
