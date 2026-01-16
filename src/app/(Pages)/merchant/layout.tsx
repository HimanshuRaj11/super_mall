import Link from 'next/link';

export default function MerchantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-indigo-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-8">Merchant Portal</h2>
                <nav className="space-y-4">
                    <Link href="/merchant" className="block p-2 hover:bg-indigo-800 rounded">
                        Dashboard
                    </Link>
                    <Link href="/merchant/products" className="block p-2 hover:bg-indigo-800 rounded">
                        My Products
                    </Link>
                    <Link href="/merchant/offers" className="block p-2 hover:bg-indigo-800 rounded">
                        My Offers
                    </Link>
                    <Link href="/merchant/settings" className="block p-2 hover:bg-indigo-800 rounded">
                        Shop Settings
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 bg-gray-50 p-8">{children}</main>
        </div>
    );
}
