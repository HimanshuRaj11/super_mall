'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logAction } from '@/services/logger';

interface Shop {
    _id: string;
    name: string;
    merchantId: {
        name: string;
        email: string;
    };
    isActive: boolean;
    createdAt: string;
}

export default function AdminShopsPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchShops = async () => {
        try {
            const res = await fetch('/api/admin/shops');
            const data = await res.json();
            setShops(data.shops || []);
        } catch (error) {
            console.error("Failed to load shops", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/shops/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) {
                fetchShops();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/shops/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchShops();
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    }

    if (loading) return <div className="p-8">Loading shops...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Shops</h1>

            <div className="grid gap-4">
                {shops.map((shop) => (
                    <Card key={shop._id} className="p-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold">{shop.name}</h3>
                            <p className="text-sm text-gray-500">Merchant: {shop.merchantId?.name} ({shop.merchantId?.email})</p>
                            <p className={`text-sm mt-1 font-medium ${shop.isActive ? 'text-green-600' : 'text-amber-600'}`}>
                                Status: {shop.isActive ? 'Active' : 'Pending Approval'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={shop.isActive ? "destructive" : "default"}
                                onClick={() => handleToggleStatus(shop._id, shop.isActive)}
                            >
                                {shop.isActive ? 'Disable' : 'Approve'}
                            </Button>
                            <Button variant="outline" onClick={() => handleDelete(shop._id)}>
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
                {shops.length === 0 && <p>No shops found.</p>}
            </div>
        </div>
    );
}
