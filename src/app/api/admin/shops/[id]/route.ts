import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shop from '@/models/Shop';
import { logAction } from '@/services/logger';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const { id } = params;
        const body = await request.json();

        const shop = await Shop.findByIdAndUpdate(id, body, { new: true });

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        // Capture user ID from header set by middleware if possible, or just log generic
        const userId = request.headers.get('x-user-id') || undefined;
        await logAction('UPDATE_SHOP_STATUS', { shopId: id, newStatus: body.isActive }, userId);

        return NextResponse.json({ shop });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const { id } = params;
        await Shop.findByIdAndDelete(id);

        const userId = request.headers.get('x-user-id') || undefined;
        await logAction('DELETE_SHOP', { shopId: id }, userId);

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
