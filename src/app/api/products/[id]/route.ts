import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
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

        const product = await Product.findById(id);
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Verify ownership
        const shop = await Shop.findById(product.shopId);
        if (!shop || String(shop.merchantId) !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await Product.findByIdAndDelete(id);
        await logAction('DELETE_PRODUCT', { productId: id }, userId || undefined);

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
