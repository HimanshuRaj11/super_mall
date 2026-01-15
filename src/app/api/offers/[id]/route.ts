import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Offer from '@/models/Offer';
import Shop from '@/models/Shop';
import { logAction } from '@/services/logger';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const userId = request.headers.get('x-user-id');
        const { id } = params;

        const offer = await Offer.findById(id);
        if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const shop = await Shop.findById(offer.shopId);
        if (!shop || String(shop.merchantId) !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await Offer.findByIdAndDelete(id);
        await logAction('DELETE_OFFER', { offerId: id }, userId || undefined);

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
