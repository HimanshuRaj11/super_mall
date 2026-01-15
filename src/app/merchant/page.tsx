'use client';

import { useEffect, useState } from 'react';
import ShopForm from '@/components/shop-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MerchantDashboard() {
    const [shop, setShop] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/merchant/shop')
            .then((res) => res.json())
            .then((data) => {
                if (data.shop) setShop(data.shop);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!shop) {
        return (
            <div>
                <h1 className="text-3xl font-bold mb-6">Welcome, Merchant!</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Create your Shop Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ShopForm />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <span className={`px-4 py-2 rounded-full text-white ${shop.isActive ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {shop.isActive ? 'Shop Active' : 'Pending Approval'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><CardTitle>My Shop: {shop.name}</CardTitle></CardHeader>
                    <CardContent>
                        <p>{shop.description}</p>
                        <Button variant="outline" className="mt-4 w-full">Edit Profile</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Link href="/merchant/products" className="w-full"><Button className="w-full">Manage Products</Button></Link>
                        <Link href="/merchant/offers" className="w-full"><Button variant="secondary" className="w-full">Create Offer</Button></Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
