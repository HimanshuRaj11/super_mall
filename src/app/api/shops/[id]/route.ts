import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shop from '@/models/Shop';
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const shop = await Shop.findById(id)
            .populate('categoryId', 'name')
            .populate('floorId', 'name');

        if (!shop || !shop.isActive) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        return NextResponse.json({ shop });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
