import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';

export async function GET() {
    await connectToDatabase();
    const categories = await Category.find().sort('name');
    return NextResponse.json({ categories });
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        // Simple admin check could be added here if not handled by middleware for APIs
        // Middleware handles path protection, but verifying user role again is good practice

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const category = await Category.create({
            name,
            slug: name.toLowerCase().replace(/ /g, '-')
        });

        return NextResponse.json({ category }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
