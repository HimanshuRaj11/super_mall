'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function MerchantProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [shop, setShop] = useState<any>(null);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', inStock: true });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Fetch shop to get ID
        fetch('/api/merchant/shop')
            .then(res => res.json())
            .then(data => {
                if (data.shop) {
                    setShop(data.shop);
                    fetch(`/api/products?shopId=${data.shop._id}`)
                        .then(r => r.json())
                        .then(p => setProducts(p.products || []));
                }
            });
    }, []);

    const handleCreate = async () => {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newProduct,
                price: parseFloat(newProduct.price)
            })
        });

        if (res.ok) {
            const data = await res.json();
            setProducts([data.product, ...products]);
            setIsDialogOpen(false);
            setNewProduct({ name: '', price: '', description: '', inStock: true });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this product?")) return;
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setProducts(products.filter(p => p._id !== id));
        }
    };

    if (!shop) return <div className="p-8">Please create a shop first.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Products</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Product</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div><Label>Name</Label><Input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} /></div>
                            <div><Label>Price</Label><Input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
                            <div><Label>Description</Label><Input value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
                            <Button onClick={handleCreate} className="w-full">Save Product</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(product => (
                    <Card key={product._id}>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-gray-500">${product.price}</p>
                            <div className="mt-4 flex gap-2">
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id)}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
