# JWT Session Management Implementation Guide

## Overview

This project implements a secure JWT-based session system with automatic token refresh. The system uses two tokens:

- **Access Token**: Short-lived (15 minutes), stored in memory only
- **Refresh Token**: Long-lived (30 days), stored in HttpOnly Secure Cookie

## Architecture

### 1. Token Storage Strategy

#### Access Token
\`\`\`
- Lifetime: 15 minutes
- Storage: React state/memory (NOT localStorage, NOT cookies)
- Transmission: Authorization header (Bearer <token>)
- Risk: XSS can read from memory, but token expires quickly
\`\`\`

#### Refresh Token
\`\`\`
- Lifetime: 30 days
- Storage: HttpOnly Secure Cookie
- Transmission: Automatic (via credentials: 'include')
- Risk: Protected from XSS, HTTPS required
\`\`\`

### 2. Key Files

#### Frontend
- **`/lib/auth-context.tsx`**: AuthProvider & useAuth hook
  - Manages access token in memory
  - Handles login/register/logout/refresh flows
  
- **`/lib/api-client.ts`**: Reusable API client with interceptors
  - Automatically adds Authorization header
  - Handles 401 TOKEN_EXPIRED responses
  - Retries requests after token refresh
  - Implements request queue to prevent concurrent refresh calls

- **`/app/dashboard/inbox/page.tsx`**: Protected inbox page
  - Example of protected route that requires authentication

#### Backend
- **`/app/api/auth/login/route.ts`**: Login endpoint
  - Returns access token in response body
  - Sets refresh token in HttpOnly cookie
  
- **`/app/api/auth/refresh/route.ts`**: Token refresh endpoint
  - Validates refresh token from cookie
  - Issues new access token
  - Optionally rotates refresh token
  
- **`/app/api/auth/register/route.ts`**: Registration endpoint
  - Creates new user account
  - Issues tokens on successful registration
  
- **`/app/api/auth/logout/route.ts`**: Logout endpoint
  - Clears refresh token cookie

## Usage

### 1. AuthProvider Setup

The AuthProvider is already configured in `/app/layout.tsx`. It initializes auth state and manages tokens.

### 2. Login Flow

\`\`\`typescript
import { useAuth } from '@/lib/auth-context'

function LoginPage() {
  const { login, isLoading } = useAuth()
  
  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password)
      // Access token stored in memory via context
      // Refresh token in HttpOnly cookie
      // User is authenticated
    } catch (error) {
      // Handle login error
    }
  }
}
\`\`\`

### 3. Protected API Calls

\`\`\`typescript
import { useAuth } from '@/lib/auth-context'
import { createApiClient } from '@/lib/api-client'

function MyComponent() {
  const { accessToken, refreshAccessToken } = useAuth()
  
  const apiClient = createApiClient(
    () => accessToken,
    refreshAccessToken
  )
  
  const fetchData = async () => {
    try {
      // API client automatically:
      // 1. Adds Authorization header with access token
      // 2. Includes credentials (for refresh token cookie)
      // 3. Handles 401 TOKEN_EXPIRED response
      // 4. Refreshes token
      // 5. Retries request
      const data = await apiClient.get('/api/some-endpoint')
    } catch (error) {
      // Handle error (e.g., refresh failed, user redirected to login)
    }
  }
}
\`\`\`

### 4. Token Refresh Flow (Automatic)

When access token expires:

\`\`\`
1. Frontend makes request with expired access token
2. Backend returns 401 with code: 'TOKEN_EXPIRED'
3. API client detects error code
4. API client calls POST /api/auth/refresh
5. Refresh token (from cookie) is sent automatically
6. Backend validates refresh token and issues new access token
7. Access token updated in React context
8. Original request retried with new access token
9. Success! User sees no interruption
\`\`\`

### 5. Logout

\`\`\`typescript
const { logout } = useAuth()

const handleLogout = () => {
  logout() // Clears access token, calls logout endpoint
}
\`\`\`

## Security Best Practices

### ✅ Implemented

- [x] Refresh token in HttpOnly cookie (XSS protected)
- [x] Access token in memory only (not in localStorage)
- [x] Short-lived access token (15 min)
- [x] Automatic token refresh on expiry
- [x] HTTPS-only cookies in production
- [x] SameSite=Strict cookie policy
- [x] credentials: 'include' for cookie transmission

### ⚠️ To Implement

- [ ] Use proper JWT library (jsonwebtoken, jose) for token generation
- [ ] Hash passwords with bcrypt before storing
- [ ] Implement CSRF protection if needed
- [ ] Add rate limiting on auth endpoints
- [ ] Implement token rotation on refresh
- [ ] Add logging/monitoring for security events
- [ ] Use environment variables for secrets
- [ ] Database persistence for users and sessions

## API Response Format

### Login/Register Response
\`\`\`json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "hasCompletedOnboarding": false
  },
  "accessToken": "eyJhbGc..."
}

Headers:
Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/
\`\`\`

### Error Response (Invalid/Expired Token)
\`\`\`json
{
  "error": "Token expired",
  "code": "TOKEN_EXPIRED"
}

Status: 401
\`\`\`

## Testing

### Test Login Flow
1. Go to /login
2. Enter credentials
3. Check DevTools > Application > Cookies for `refreshToken`
4. Check Network tab: login response contains `accessToken`

### Test Token Refresh
1. Wait for access token to expire (15 min)
2. Make an API request
3. Check Network tab: 401 response, then refresh call, then retry with new token

### Test Logout
1. Click logout
2. Check cookies: `refreshToken` should be deleted
3. Redirect to /login

## Troubleshooting

### Issue: "Token has expired" after login
- **Cause**: Access token lifetime too short
- **Solution**: Increase token lifetime in /app/api/auth/login/route.ts

### Issue: User logged out unexpectedly
- **Cause**: Refresh token cookie not being sent
- **Solution**: Check credentials: 'include' in fetch requests

### Issue: Infinite redirect loop on protected pages
- **Cause**: Refresh token is invalid/expired
- **Solution**: Clear cookies and login again

## Next Steps

1. **Replace mock implementation** with real database
   - Implement user registration with password hashing
   - Store users and sessions in database
   
2. **Use production JWT library**
   \`\`\`bash
   npm install jsonwebtoken
   # or
   npm install jose
   \`\`\`

3. **Add more security measures**
   - CSRF tokens
   - Rate limiting
   - Device fingerprinting
   - Login history tracking

4. **Implement refresh token rotation**
   - Issue new refresh token on each refresh
   - Maintain token family for security

5. **Add analytics**
   - Log auth events
   - Monitor failed login attempts
   - Track session activity

## References

- [JWT.io](https://jwt.io/) - JWT specification
- [Node.js jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)
