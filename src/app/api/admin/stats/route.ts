import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Shop from '@/models/Shop'; // I need to create Shop model if I haven't implemented it fully (I did)

export async function GET() {
    try {
        await connectToDatabase();

        const totalUsers = await User.countDocuments();
        const activeShops = await Shop.countDocuments({ isActive: true });
        const pendingShops = await Shop.countDocuments({ isActive: false });

        return NextResponse.json({
            totalUsers,
            activeShops,
            pendingShops,
        });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
