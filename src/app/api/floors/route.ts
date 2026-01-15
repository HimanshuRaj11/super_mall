import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Floor from '@/models/Floor';

export async function GET() {
    await connectToDatabase();
    const floors = await Floor.find().sort('level');
    return NextResponse.json({ floors });
}
