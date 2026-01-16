'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const shopRes = await fetch(`/api/shops/${id}`);
            const shopData = await shopRes.json();
            setShop(shopData.shop);

            if (shopData.shop) {
                const prodRes = await fetch(`/api/products?shopId=${id}`);
                const prodData = await prodRes.json();
                setProducts(prodData.products || []);

                const offerRes = await fetch(`/api/offers?shopId=${id}`);
                const offerData = await offerRes.json();
                setOffers(offerData.offers || []);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const addToCompare = (product: any) => {
        const current = JSON.parse(localStorage.getItem('compareWaitlist') || '[]');
        if (current.find((p: any) => p._id === product._id)) return alert("Already added");
        if (current.length >= 3) return alert("Can only compare 3 products");

        localStorage.setItem('compareWaitlist', JSON.stringify([...current, product]));
        alert("Added to compare");
    };

    if (loading) return <div>Loading...</div>;
    if (!shop) return <div>Shop not found</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {shop.image ? <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" /> : <span className="text-gray-400">No Image</span>}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <Badge className="mb-2">{shop.categoryId?.name}</Badge>
                        <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
                        <p className="text-gray-600 mb-4">{shop.description}</p>
                        <p className="font-medium text-gray-800">Floor: {shop.floorId?.name}</p>
                    </div>
                </div>
            </div>

            {/* Offers */}
            {offers.length > 0 && (
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-4">Active Offers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {offers.map(offer => (
                            <div key={offer._id} className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg shadow-lg">
                                <h3 className="font-bold text-xl">{offer.title}</h3>
                                <div className="text-4xl font-extrabold my-2">{offer.discountPercentage}% OFF</div>
                                <p className="opacity-90 text-sm">Valid until {new Date(offer.endDate).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Products */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <Card key={product._id} className="hover:shadow-md transition">
                            <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                                {product.images && product.images[0] ? <img src={product.images[0]} /> : <span className="text-gray-400">No Image</span>}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-bold text-lg">${product.price}</span>
                                    {product.inStock ? <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">In Stock</span> : <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">Out of Stock</span>}
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => addToCompare(product)}>Add to Compare</Button>
                            </CardContent>
                        </Card>
                    ))}
                    {products.length === 0 && <p>No products listed yet.</p>}
                </div>
            </div>
        </div>
    );
}
