# Quick Start: JWT Session Management

## 🚀 Getting Started

### 1. Test the Login Flow

\`\`\`bash
# 1. Start the development server
npm run dev

# 2. Navigate to http://localhost:3000/login

# 3. Enter credentials:
#    Email: any@email.com
#    Password: password123 (at least 8 chars)

# 4. You'll be redirected to dashboard
\`\`\`

### 2. Inspect Tokens

**In Browser DevTools:**

\`\`\`
Console:
- Open DevTools (F12)
- Go to "Application" tab
- Click "Cookies" → localhost:3000
- Look for "refreshToken" (HttpOnly, Secure)

Network:
- Open "Network" tab
- Go to /login
- Click the login request
- Response tab shows: { accessToken: "..." }
- Response headers show: Set-Cookie: refreshToken=...
\`\`\`

### 3. Use the Inbox

\`\`\`
1. Login successfully
2. Navigate to Dashboard → Inbox
3. See conversations list
4. Click a conversation to view chat
5. Responsive design:
   - Mobile: Single column
   - Tablet: Two columns
   - Desktop: Three columns
\`\`\`

## 🔒 Security Overview

| Component | Lifetime | Storage | Security |
|-----------|----------|---------|----------|
| Access Token | 15 min | Memory | Expires quickly, XSS risk |
| Refresh Token | 30 days | HttpOnly Cookie | XSS protected, HTTPS only |

## 📋 API Endpoints

### Login
\`\`\`
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": { ... },
  "accessToken": "eyJ..."
}

Cookies Set:
- refreshToken (HttpOnly, Secure, 30 days)
\`\`\`

### Refresh Token
\`\`\`
POST /api/auth/refresh
(Refresh token sent automatically in cookie)

Response:
{
  "success": true,
  "accessToken": "eyJ..."
}

Cookies Updated:
- refreshToken (rotated)
\`\`\`

### Logout
\`\`\`
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}

Cookies Cleared:
- refreshToken (deleted)
\`\`\`

### Register
\`\`\`
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": { ... },
  "accessToken": "eyJ..."
}

Cookies Set:
- refreshToken (HttpOnly, Secure, 30 days)
\`\`\`

## 🛠️ Using Auth in Components

### Get Current User & Token

\`\`\`typescript
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, accessToken, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please login first</div>
  }
  
  return <div>Hello, {user?.firstName}</div>
}
\`\`\`

### Make Protected API Calls

\`\`\`typescript
import { useAuth } from '@/lib/auth-context'
import { createApiClient } from '@/lib/api-client'

function DataFetcher() {
  const { accessToken, refreshAccessToken } = useAuth()
  
  // Create API client with token handlers
  const api = createApiClient(() => accessToken, refreshAccessToken)
  
  const loadData = async () => {
    try {
      // API client automatically:
      // - Adds "Authorization: Bearer <token>" header
      // - Detects 401 TOKEN_EXPIRED
      // - Refreshes token
      // - Retries request
      const data = await api.get('/api/data')
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }
}
\`\`\`

### Login User

\`\`\`typescript
import { useAuth } from '@/lib/auth-context'

function LoginForm() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  
  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password)
      // User is now authenticated
      // Access token in memory
      // Refresh token in cookie
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}
\`\`\`

### Logout User

\`\`\`typescript
import { useAuth } from '@/lib/auth-context'

function LogoutButton() {
  const { logout } = useAuth()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    // Clears access token
    // Calls logout endpoint to clear refresh token
    router.push('/login')
  }
  
  return <button onClick={handleLogout}>Logout</button>
}
\`\`\`

## 🧪 Testing Token Refresh

### Simulate Expired Token

1. **Wait 15 minutes** OR
2. **Manually expire token:**
   \`\`\`typescript
   // In browser console after login:
   localStorage.setItem('faheem_user', JSON.stringify({...}))
   // Then make API request - should trigger refresh
   \`\`\`

### Watch Refresh Happen

1. Open DevTools → Network tab
2. Make an API request to protected endpoint
3. Watch for:
   - Initial request returns 401 TOKEN_EXPIRED
   - /api/auth/refresh is called
   - Original request is retried with new token
   - Returns 200 OK

## 🌍 Language Support

The inbox page supports both English and Arabic:

\`\`\`typescript
import { useLanguage } from '@/lib/language-context'

function MyComponent() {
  const { language } = useLanguage() // 'en' or 'ar'
  
  const text = language === 'ar' ? 'مرحباً' : 'Hello'
}
\`\`\`

**RTL Support:**
- Sidebar adapts for RTL
- Inbox chat adapts for RTL
- All text direction respects language

## 📱 Responsive Inbox

The inbox layout automatically adapts:

\`\`\`
Mobile (< 768px):
- Hidden: Conversation list
- Shows: Selected conversation only

Tablet (768px - 1200px):
- Shows: List (300px) + Chat
- Hidden: Details panel

Desktop (> 1200px):
- Shows: List + Chat + Details panel
- Full 3-column layout
\`\`\`

## 🐛 Troubleshooting

### "Not authenticated" after login
- **Check**: Is `accessToken` in auth context?
- **Fix**: Login again, verify tokens in DevTools

### Token refresh not working
- **Check**: Is refresh token in cookie?
- **Fix**: Ensure `credentials: 'include'` in API calls

### CORS errors
- **Check**: Is your frontend on same domain as API?
- **Fix**: For local dev, both should be on localhost:3000

### Cookies not being set
- **Check**: Is your app using HTTPS?
- **Fix**: Local dev uses http (that's ok), production must use https

## 📚 Full Documentation

- **JWT_IMPLEMENTATION_GUIDE.md**: Detailed JWT documentation
- **IMPLEMENTATION_SUMMARY.md**: All changes made
- **Code comments**: Inline documentation in source files

## 🎯 Next Steps

1. ✅ Test login/logout flow
2. ✅ Verify tokens in DevTools
3. ✅ Test inbox functionality
4. ✅ Test responsive design
5. 📝 Replace mock implementation with real database
6. 🔐 Add proper JWT library (jsonwebtoken)
7. 🔐 Hash passwords with bcrypt
8. 📊 Add analytics & monitoring

## 💡 Pro Tips

**Tip 1**: Check `isLoading` while making requests
\`\`\`typescript
const { isLoading } = useAuth()
if (isLoading) return <LoadingSpinner />
\`\`\`

**Tip 2**: Use error boundaries for graceful error handling
\`\`\`typescript
<ErrorBoundary fallback={<ErrorPage />}>
  <ProtectedComponent />
</ErrorBoundary>
\`\`\`

**Tip 3**: Monitor token expiry in the future
\`\`\`typescript
// Implement a timer that refreshes token before expiry
useEffect(() => {
  const timer = setInterval(() => {
    // Refresh at 10 min (before 15 min expiry)
    refreshAccessToken()
  }, 10 * 60 * 1000)
  
  return () => clearInterval(timer)
}, [refreshAccessToken])
\`\`\`

**Tip 4**: Log auth events for debugging
\`\`\`typescript
console.log('[v0] User logged in:', user)
console.log('[v0] Token refreshed at:', new Date())
\`\`\`

---

**Questions?** Check the full documentation files or examine the source code comments.
