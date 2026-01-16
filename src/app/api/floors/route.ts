import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Floor from '@/models/Floor';

export async function getFloors() {
    await connectToDatabase();
    return await Floor.find().sort({ level: 1 });
}

export async function GET() {
    try {
        const floors = await getFloors();
        return NextResponse.json({ floors });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        if (!body.name || body.level === undefined) {
            return NextResponse.json({ error: 'Name and Level are required' }, { status: 400 });
        }

        const floor = await Floor.create(body);
        return NextResponse.json({ floor }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Floor name or level already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
