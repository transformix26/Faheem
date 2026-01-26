import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/login
 * 
 * Login endpoint that issues JWT tokens
 * - Access Token: 15 minutes, returned in response body
 * - Refresh Token: 30 days, set in HttpOnly Secure Cookie
 */

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required', code: 'INVALID_INPUT' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database lookup and password verification
    // This is a mock implementation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // Mock user data
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      firstName: 'User',
      lastName: 'Name',
      phoneNumber: '+1234567890',
      hasCompletedOnboarding: true,
    }

    // Generate tokens
    const accessToken = generateAccessToken(mockUser)
    const refreshToken = generateRefreshToken(mockUser)

    // Create response
    const response = NextResponse.json({
      success: true,
      user: mockUser,
      accessToken,
    })

    // Set refresh token in HttpOnly Secure Cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

function generateAccessToken(user: any): string {
  // In production, use a proper JWT library (jsonwebtoken)
  // This is a simplified mock implementation
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
  // In production, use a proper JWT library (jsonwebtoken)
  // This is a simplified mock implementation
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
