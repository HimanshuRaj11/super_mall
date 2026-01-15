import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import Shop from '@/models/Shop'; // Active shops
import Offer from '@/models/Offer'; // Active offers

export const dynamic = 'force-dynamic';

async function getData() {
  await connectToDatabase();
  const categories = await Category.find().limit(6);
  // Get featured/active shops (limit 4)
  const shops = await Shop.find({ isActive: true }).limit(4).populate('floorId');
  // Get active offers (limit 4)
  const offers = await Offer.find({ isActive: true }).limit(4).populate('shopId');

  return { categories, shops, offers };
}

export default async function Home() {
  const { categories, shops, offers } = await getData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6">Welcome to Super Mall</h1>
          <p className="text-xl mb-8 opacity-90">Experience the best shopping, dining, and entertainment under one roof.</p>
          <div className="flex justify-center gap-4">
            <Link href="/shops"><Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-100">Browse Shops</Button></Link>
            <Link href="/offers"><Button size="lg" variant="outline" className="text-white border-white hover:bg-indigo-800">View Offers</Button></Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {JSON.parse(JSON.stringify(categories)).map((cat: any) => (
              <Link key={cat._id} href={`/shops?category=${cat._id}`} className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition text-center">
                <span className="font-semibold block">{cat.name}</span>
              </Link>
            ))}
            {categories.length === 0 && <p className="text-center col-span-full">No categories found.</p>}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Shops</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {JSON.parse(JSON.stringify(shops)).map((shop: any) => (
              <div key={shop._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                  {shop.image ? <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" /> : 'No Image'}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{shop.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{shop.floorId?.name || 'Grand Floor'}</p>
                  <Link href={`/shops/${shop._id}`}><Button variant="outline" size="sm" className="w-full">Visit Shop</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Trending Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {JSON.parse(JSON.stringify(offers)).map((offer: any) => (
              <div key={offer._id} className="bg-white rounded-lg p-6 shadow-md border-t-4 border-t-indigo-600">
                <div className="text-indigo-600 font-bold text-sm mb-1">{offer.shopId?.name}</div>
                <h3 className="font-bold text-xl mb-2">{offer.title}</h3>
                <div className="text-3xl font-extrabold text-green-600 mb-4">{offer.discountPercentage}% OFF</div>
                <Link href={`/shops/${offer.shopId?._id}`}><Button size="sm" className="w-full">Get Deal</Button></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 text-center">
        <p>&copy; 2024 Super Mall. All rights reserved.</p>
      </footer>
    </div>
  );
}
