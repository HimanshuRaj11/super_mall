import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-slate-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-4">
                    <Link href="/admin" className="block p-2 hover:bg-slate-800 rounded">
                        Dashboard
                    </Link>
                    <Link href="/admin/shops" className="block p-2 hover:bg-slate-800 rounded">
                        Manage Shops
                    </Link>
                    <Link href="/admin/users" className="block p-2 hover:bg-slate-800 rounded">
                        Manage Users
                    </Link>
                    <Link href="/admin/categories" className="block p-2 hover:bg-slate-800 rounded">
                        Categories & Floors
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 bg-slate-100 p-8">{children}</main>
        </div>
    );
}
