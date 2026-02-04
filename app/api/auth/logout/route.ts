import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * 
 * Logout endpoint that clears the refresh token cookie
 */

export async function POST(request: NextRequest) {
  try {
    // --- باك حقيقي (Real Backend) ---
    /*
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (backendUrl && refreshToken) {
      try {
        await fetch(`${backendUrl}/api/v1/auth/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}` // Or however the backend expects it
          },
        });
      } catch (err) {
        console.error('Backend logout error:', err);
      }
    }
    */

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
