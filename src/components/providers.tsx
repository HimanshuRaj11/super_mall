'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider'; // Shadcn might need this

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
