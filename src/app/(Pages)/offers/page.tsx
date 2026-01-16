
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import connectToDatabase from '@/lib/db';
import Offer from '@/models/Offer';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

async function getOffers() {
    await connectToDatabase();
    // Ensure we populate shopId to get shop name
    const offers = await Offer.find({ isActive: true }).populate('shopId').sort({ createdAt: -1 });
    return offers;
}

export default async function OffersPage() {
    const offers = await getOffers();

    return (
        <div className="min-h-screen flex flex-col bg-indigo-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-indigo-900">Current Offers</h1>

                {offers.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No active offers at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {JSON.parse(JSON.stringify(offers)).map((offer: any) => (
                            <div key={offer._id} className="bg-white rounded-lg p-6 shadow-md border-t-4 border-t-indigo-600 flex flex-col h-full">
                                <div className="mb-4">
                                    <div className="text-indigo-600 font-bold text-sm mb-1">{offer.shopId?.name || 'Shop'}</div>
                                    <h3 className="font-bold text-xl mb-2 text-gray-800">{offer.title}</h3>
                                    <div className="text-3xl font-extrabold text-green-600 mb-2">{offer.discountPercentage && `${offer.discountPercentage}% OFF`}</div>
                                    {offer.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{offer.description}</p>}
                                </div>

                                <div className="mt-auto">
                                    <div className="text-xs text-gray-400 mb-4">
                                        Valid until: {format(new Date(offer.endDate), 'MMM dd, yyyy')}
                                    </div>
                                    <Link href={`/shops/${offer.shopId?._id}`} className="block">
                                        <Button size="sm" className="w-full">Get Deal</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
