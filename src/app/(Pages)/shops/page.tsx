'use client';

import { Suspense, useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function ShopListContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Filters
    const [categories, setCategories] = useState<any[]>([]);
    const [floors, setFloors] = useState<any[]>([]);
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedFloor, setSelectedFloor] = useState(searchParams.get('floor') || '');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Load metadata
        fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
        fetch('/api/floors').then(r => r.json()).then(d => setFloors(d.floors || []));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedFloor) params.set('floor', selectedFloor);
        if (searchTerm) params.set('search', searchTerm);

        fetch(`/api/shops?${params.toString()}`)
            .then(r => r.json())
            .then(d => {
                setShops(d.shops || []);
                setLoading(false);
            });
    }, [selectedCategory, selectedFloor, searchTerm]); // Quick debounce ideally for search

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Browse Shops</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 space-y-8">
                    <div>
                        <h3 className="font-semibold mb-3">Search</h3>
                        <Input
                            placeholder="Shop name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Floor</h3>
                        <div className="space-y-2">
                            <Button
                                variant={selectedFloor === '' ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setSelectedFloor('')}
                            >All Floors</Button>
                            {floors.map(f => (
                                <Button
                                    key={f._id}
                                    variant={selectedFloor === f._id ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedFloor(f._id)}
                                >
                                    {f.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Category</h3>
                        <div className="space-y-2">
                            <Button
                                variant={selectedCategory === '' ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setSelectedCategory('')}
                            >All Categories</Button>
                            {categories.map(c => (
                                <Button
                                    key={c._id}
                                    variant={selectedCategory === c._id ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedCategory(c._id)}
                                >
                                    {c.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Shop Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div>Loading shops...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {shops.length > 0 ? (
                                shops.map(shop => (
                                    <Link key={shop._id} href={`/shops/${shop._id}`}>
                                        <Card className="hover:shadow-lg transition cursor-pointer h-full">
                                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                                {shop.image ? <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" /> : <span className="text-gray-400">No Image</span>}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="text-xl font-bold mb-1">{shop.name}</h3>
                                                <div className="flex justify-between text-sm text-gray-500">
                                                    <span>{shop.categoryId?.name}</span>
                                                    <span>{shop.floorId?.name}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <p>No shops found matching filters.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopListPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <ShopListContent />
            </Suspense>
        </div>
    );
}
