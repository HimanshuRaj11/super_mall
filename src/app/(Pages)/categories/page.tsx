
import Navbar from '@/components/navbar';
import Link from 'next/link';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

async function getCategories() {
    await connectToDatabase();
    const categories = await Category.find().sort({ name: 1 });
    return categories;
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Shop by Category</h1>

                {categories.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No categories found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {JSON.parse(JSON.stringify(categories)).map((cat: any) => (
                            <Link key={cat._id} href={`/shops?category=${cat._id}`} className="block group">
                                <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition p-8 text-center h-full flex flex-col items-center justify-center border border-gray-100 group-hover:border-indigo-200">
                                    {cat.image && (
                                        <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain mb-4 opacity-75 group-hover:opacity-100 transition" />
                                    )}
                                    <span className="font-bold text-lg text-gray-700 group-hover:text-indigo-600 transition">{cat.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
