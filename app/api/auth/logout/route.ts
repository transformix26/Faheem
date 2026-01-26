import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * 
 * Logout endpoint that clears the refresh token cookie
 */

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Clear refresh token cookie
    response.cookies.delete('refreshToken')

    return response
  } catch (error) {
    console.error('[v0] Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
