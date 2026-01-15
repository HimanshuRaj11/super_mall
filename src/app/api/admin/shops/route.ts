import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shop from '@/models/Shop'; // Correct import

export async function GET() {
    try {
        await connectToDatabase();
        // Populate merchant details
        const shops = await Shop.find().populate('merchantId', 'name email').sort({ createdAt: -1 });

        return NextResponse.json({ shops }, { status: 200 });
    } catch (error) {
        console.error('Admin Shops API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
