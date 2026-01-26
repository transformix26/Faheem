import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // In a real app, you would:
        // 1. Verify the user (via token)
        // 2. Save preferences to the database
        // 3. Mark the user as having completed onboarding

        // For now, we simulate a successful save
        console.log('[Mock API] Onboarding completed with:', body)

        return NextResponse.json({
            success: true,
            message: 'Onboarding completed successfully'
        })
    } catch (error) {
        console.error('[Mock API] Onboarding error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
