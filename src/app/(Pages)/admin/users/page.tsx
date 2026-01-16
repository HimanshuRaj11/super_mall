"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users");
                const data = await res.json();
                setUsers(data.users || []);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Users</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Name</th>
                                        <th className="p-3 text-left font-medium">Email</th>
                                        <th className="p-3 text-left font-medium">Role</th>
                                        <th className="p-3 text-left font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="p-3 font-medium">{user.name}</td>
                                                <td className="p-3 text-gray-500">{user.email}</td>
                                                <td className="p-3">
                                                    <Badge variant={user.role === 'admin' ? 'default' : user.role === 'merchant' ? 'secondary' : 'outline'}>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
