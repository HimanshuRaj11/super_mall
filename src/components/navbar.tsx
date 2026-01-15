'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/theme-provider'; // Actually not needed here directly
// But I need the ModeToggle if I want it. I'll stick to simple links first.

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                    SuperMall
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="/shops" className="hover:text-indigo-600 font-medium">Shops</Link>
                    <Link href="/offers" className="hover:text-indigo-600 font-medium">Offers</Link>
                    <Link href="/categories" className="hover:text-indigo-600 font-medium">Categories</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link href="/admin">
                                    <Button variant="ghost">Admin Dashboard</Button>
                                </Link>
                            )}
                            {user.role === 'merchant' && (
                                <Link href="/merchant">
                                    <Button variant="ghost">Merchant Portal</Button>
                                </Link>
                            )}
                            {user.role === 'user' && (
                                <span className="text-sm font-medium">Hi, {user.name}</span>
                            )}
                            <Button onClick={logout} variant="outline">Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login"><Button variant="ghost">Login</Button></Link>
                            <Link href="/register"><Button>Sign Up</Button></Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
