import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import { logAction } from '@/services/logger';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        // Validate User
        const userId = req.headers.get('x-user-id');
        const role = req.headers.get('x-user-role');
        if (!userId || (role !== 'merchant' && role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Verify shop ownership
        const shop = await Shop.findOne({ merchantId: userId });
        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        const product = await Product.create({
            ...body,
            shopId: shop._id
        });

        await logAction('CREATE_PRODUCT', { productId: product._id, shopId: shop._id }, userId);

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Create Product Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get('shopId');

        const filter: any = {};
        if (shopId) filter.shopId = shopId;

        // Populate optional category field if it was a ref, but here it's string.
        const products = await Product.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({ products });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
