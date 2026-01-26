# Faheem Project Guide

## 1. Project Overview
This project is a **Dashboard** for managing an AI Chatbot named **"Faheem"**.
It is built using the latest technologies:
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Language**: TypeScript

### Current Project Components:
1. **UI/UX**:
   - Authentication system (`login`, `register`).
   - Dashboard displaying statistics (Messages, Users, Performance).
   - Bi-lingual support (Arabic & English) via `LanguageContext`.
2. **State Management**:
   - `AuthContext`: Manages user state and authentication.
   - `BotContext`: Manages active bot data.

---

## 2. Missing Parts & Requirements
The project currently represents the **Frontend** only. To function fully, it needs:

1. **Backend Server (Node.js)**:
   - To handle authentication and store data in a database (e.g., MongoDB, PostgreSQL).
   - Currently, the project expects an API at the `/api` path.

2. **API Integration**:
   - All requests originate from `lib/api-client.ts` and await real responses.

---

## 3. Backend Integration (Node.js)
When building your Node.js server, there are two ways to connect:

### Recommended: Use Next.js Rewrites (Proxy)
To avoid CORS issues, configure Next.js to act as a proxy, forwarding requests to your Node.js server.

**Steps:**
1. Open `next.config.mjs`.
2. Add `rewrites` configuration to forward any request starting with `/api` to your server (e.g., running on port 3001).

```javascript
// next.config.mjs
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Your backend URL
      },
    ]
  },
};
export default nextConfig;
```
With this setup, when the Frontend requests `/api/auth/login`, Next.js internally forwards it to `http://localhost:3001/api/auth/login`.

---

## 4. Login & Token Strategy
This part is critical and has been designed in `lib/auth-context.ts` and `lib/api-client.ts` to follow best security practices.

### Token Storage Strategy

The project uses a **Dual Token** strategy (Access Token & Refresh Token):

1. **Access Token:**
   - **Storage**: **Memory Only (React State)** within `accessToken` in `AuthContext`.
   - **Why?**: To prevent XSS attacks. If the browser is compromised, the attacker cannot read the token from LocalStorage because it's not there.
   - **Persistence**: It is lost on page refresh, so we rely on the Refresh Token to restore it.

2. **Refresh Token:**
   - **Storage**: Must be sent from the Backend in an **HttpOnly Cookie**.
   - **Why?**: HttpOnly cookies cannot be accessed via JavaScript, protecting it from theft.
   - **Function**: On page refresh or when the Access Token expires, the frontend requests `/api/auth/refresh`. The browser automatically sends the cookie, and the server verifies it and issues a new Access Token.

3. **User Data:**
   - **Storage**: **LocalStorage** under `faheem_user`.
   - **Content**: Non-sensitive data (Name, Email, Status). Used for immediate UI rendering on load.

### Required Backend Endpoints:

The Node.js server must provide the following endpoints:

| Endpoint | Method | Expected Function |
| --- | --- | --- |
| `/api/auth/login` | POST | Receives `email` & `password`. Returns `accessToken` (JSON) and `refreshToken` (Cookie). |
| `/api/auth/register` | POST | Creates a new account. Returns same as Login. |
| `/api/auth/refresh` | POST | Verifies Cookie and returns a new `accessToken`. |
| `/api/auth/logout` | POST | Clears the Refresh Token Cookie. |
| `/api/auth/onboarding` | POST | Saves new user preferences. |

### Example Backend Code (Express.js) for Sending Cookies:

```javascript
// Example of how to send tokens from Backend
app.post('/api/auth/login', (req, res) => {
  // ... Validate user ...

  // 1. Generate Tokens
  const accessToken = jwt.sign({ id: user.id }, 'access_secret', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, 'refresh_secret', { expiresIn: '7d' });

  // 2. Send Refresh Token in HttpOnly Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // 3. Send Access Token in JSON Response
  res.json({
    accessToken,
    user: { id: user.id, email: user.email, ... }
  });
});
```
