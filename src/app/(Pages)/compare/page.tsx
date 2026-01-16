'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ComparePage() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('compareWaitlist');
        if (stored) {
            setProducts(JSON.parse(stored));
        }
    }, []);

    const clear = () => {
        localStorage.removeItem('compareWaitlist');
        setProducts([]);
    };

    if (products.length === 0) return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <p>No products to compare. Add some from shop pages.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Compare Products</h1>
                    <Button variant="destructive" onClick={clear}>Clear All</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-4 text-left">Feature</th>
                                {products.map(p => (
                                    <th key={p._id} className="p-4 text-left border-l">{p.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4 font-semibold border-t">Price</td>
                                {products.map(p => (
                                    <td key={p._id} className="p-4 border-t border-l text-xl font-bold">${p.price}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold border-t">Availability</td>
                                {products.map(p => (
                                    <td key={p._id} className="p-4 border-t border-l">
                                        {p.inStock ? <span className="text-green-600">In Stock</span> : <span className="text-red-500">Out of Stock</span>}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold border-t">Description</td>
                                {products.map(p => (
                                    <td key={p._id} className="p-4 border-t border-l text-sm text-gray-600">{p.description}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
