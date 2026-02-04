import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/refresh
 * 
 * Token refresh endpoint
 * - Validates refresh token from HttpOnly cookie
 * - Issues new access token
 * - Optionally rotates refresh token
 */

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from HttpOnly cookie
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided', code: 'NO_REFRESH_TOKEN' },
        { status: 401 }
      )
    }

    // --- باك حقيقي (Real Backend) ---
    /*
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
      try {
        const backendResponse = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        
        const data = await backendResponse.json();
        
        if (!backendResponse.ok) {
          const res = NextResponse.json(
            { error: data.message || 'Refresh failed', code: data.code || 'BACKEND_ERROR' },
            { status: backendResponse.status }
          );
          res.cookies.delete('refreshToken');
          return res;
        }

        const response = NextResponse.json({
          success: true,
          accessToken: data.accessToken,
        });

        response.cookies.set('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });

        return response;
      } catch (err) {
        console.error('Backend connection error:', err);
      }
    }
    */

    // Verify refresh token (in production, use JWT library)
    const verified = verifyRefreshToken(refreshToken)
    if (!verified) {
      // Invalid or expired refresh token
      const response = NextResponse.json(
        { error: 'Invalid refresh token', code: 'INVALID_REFRESH_TOKEN' },
        { status: 401 }
      )
      // Clear the refresh token cookie
      response.cookies.delete('refreshToken')
      return response
    }

    // Mock user data (in production, fetch from database)
    const mockUser = {
      id: verified.sub,
      email: 'user@example.com',
      firstName: 'User',
      lastName: 'Name',
      phoneNumber: '+1234567890',
      hasCompletedOnboarding: true,
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(mockUser)

    // Optionally rotate refresh token (recommended)
    const newRefreshToken = generateRefreshToken(mockUser)

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    })

    // Update refresh token cookie
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

function generateAccessToken(user: any): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
    })
  ).toString('base64')
  const signature = 'mock_signature'
  return `${header}.${payload}.${signature}`
}

function generateRefreshToken(user: any): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    })
  ).toString('base64')
  const signature = 'mock_signature'
  return `${header}.${payload}.${signature}`
}

function verifyRefreshToken(token: string): any {
  // In production, use JWT library to verify signature and expiry
  // This is a simplified mock that assumes valid tokens
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
