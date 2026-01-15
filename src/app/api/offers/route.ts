import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Offer from '@/models/Offer';
import Shop from '@/models/Shop';
import { logAction } from '@/services/logger';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const userId = req.headers.get('x-user-id');
        const role = req.headers.get('x-user-role');

        if (!userId || (role !== 'merchant' && role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const shop = await Shop.findOne({ merchantId: userId });

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        const offer = await Offer.create({
            ...body,
            shopId: shop._id
        });

        await logAction('CREATE_OFFER', { offerId: offer._id, shopId: shop._id }, userId);

        return NextResponse.json({ offer }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get('shopId');
    const filter: any = {};
    if (shopId) filter.shopId = shopId;

    const offers = await Offer.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ offers });
}
