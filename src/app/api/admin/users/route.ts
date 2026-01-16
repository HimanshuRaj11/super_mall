
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        // Middleware verifies Admin role, so we can trust it here if we want, 
        // but let's double check headers usually set by middleware if we were strict.
        // For now, assuming middleware protects /api/admin/* paths.

        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return NextResponse.json({ users });
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
