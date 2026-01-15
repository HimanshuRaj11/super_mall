import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shop from '@/models/Shop';

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const floor = searchParams.get('floor');
        const search = searchParams.get('search'); // Basic name search

        const filter: any = { isActive: true };
        if (category) filter.categoryId = category;
        if (floor) filter.floorId = floor;
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const shops = await Shop.find(filter)
            .populate('categoryId', 'name')
            .populate('floorId', 'name')
            .sort('name');

        return NextResponse.json({ shops });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
