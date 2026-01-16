'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function MerchantOffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [newOffer, setNewOffer] = useState({ title: '', discountPercentage: '', startDate: '', endDate: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchOffers = (shopId: string) => {
        fetch(`/api/offers?shopId=${shopId}`)
            .then(r => r.json())
            .then(data => setOffers(data.offers || []));
    };

    useEffect(() => {
        fetch('/api/merchant/shop')
            .then(res => res.json())
            .then(data => {
                if (data.shop) {
                    fetchOffers(data.shop._id);
                }
            });
    }, []);

    const handleCreate = async () => {
        const res = await fetch('/api/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newOffer,
                discountPercentage: parseFloat(newOffer.discountPercentage)
            })
        });

        if (res.ok) {
            setIsDialogOpen(false);
            setNewOffer({ title: '', discountPercentage: '', startDate: '', endDate: '' });
            // Refresh
            window.location.reload();
        } else {
            alert('Failed to create offer');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete?")) return;
        const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setOffers(offers.filter(o => o._id !== id));
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Offers</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Offer</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>New Offer</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div><Label>Title</Label><Input value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })} /></div>
                            <div><Label>Discount %</Label><Input type="number" value={newOffer.discountPercentage} onChange={e => setNewOffer({ ...newOffer, discountPercentage: e.target.value })} /></div>
                            <div><Label>Start Date</Label><Input type="date" value={newOffer.startDate} onChange={e => setNewOffer({ ...newOffer, startDate: e.target.value })} /></div>
                            <div><Label>End Date</Label><Input type="date" value={newOffer.endDate} onChange={e => setNewOffer({ ...newOffer, endDate: e.target.value })} /></div>
                            <Button onClick={handleCreate} className="w-full">Create</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map(offer => (
                    <Card key={offer._id}>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg">{offer.title}</h3>
                            <p className="text-2xl text-green-600">{offer.discountPercentage}% OFF</p>
                            <p className="text-sm text-gray-500">{new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}</p>
                            <Button variant="destructive" size="sm" className="mt-2" onClick={() => handleDelete(offer._id)}>Remove</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
