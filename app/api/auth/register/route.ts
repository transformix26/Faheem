import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/register
 * 
 * Registration endpoint
 * - Creates new user account
 * - Issues JWT tokens (access + refresh)
 */

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phoneNumber } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'INVALID_INPUT' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters', code: 'WEAK_PASSWORD' },
        { status: 400 }
      )
    }

    // --- باك حقيقي (Real Backend) ---
    /*
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
      try {
        const backendResponse = await fetch(`${backendUrl}/api/v1/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, firstName, lastName, phoneNumber })
        });
        
        const data = await backendResponse.json();
        
        if (!backendResponse.ok) {
          return NextResponse.json(
            { error: data.message || 'Registration failed', code: data.code || 'BACKEND_ERROR' },
            { status: backendResponse.status }
          );
        }

        const response = NextResponse.json({
          success: true,
          user: data.user,
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

    // Mock implementation assumes user doesn't exist
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      firstName,
      lastName,
      phoneNumber: phoneNumber || '',
      hasCompletedOnboarding: false,
    }

    // Generate tokens
    const accessToken = generateAccessToken(newUser)
    const refreshToken = generateRefreshToken(newUser)

    const response = NextResponse.json({
      success: true,
      user: newUser,
      accessToken,
    })

    // Set refresh token in HttpOnly cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Registration error:', error)
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
