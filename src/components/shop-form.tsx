'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function ShopForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        categoryId: initialData?.categoryId || '',
        floorId: initialData?.floorId || '',
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [floors, setFloors] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/categories').then((res) => res.json()).then(data => setCategories(data.categories || []));
        fetch('/api/floors').then((res) => res.json()).then(data => setFloors(data.floors || []));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/merchant/shop', {
            method: 'POST', // or PATCH logic handled in API based on existence, but form might need to know. 
            // Actually API handles update if exists.
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.refresh(); // Reload to show dashboard
        } else {
            alert("Failed to save shop");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
                <Label htmlFor="name">Shop Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                        id="category"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <Label htmlFor="floor">Floor</Label>
                    <select
                        id="floor"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.floorId}
                        onChange={(e) => setFormData({ ...formData, floorId: e.target.value })}
                        required
                    >
                        <option value="">Select Floor</option>
                        {floors.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                        {floors.length === 0 && <option value="fake_floor_id">Ground Floor (Please seed DB)</option>}
                    </select>
                </div>
            </div>

            <Button type="submit">{initialData ? 'Update Shop' : 'Create Shop'}</Button>
        </form>
    );
}
