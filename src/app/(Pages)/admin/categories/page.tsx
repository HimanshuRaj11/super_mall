"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AdminCategoriesPage() {
    const [activeTab, setActiveTab] = useState("categories");

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Categories & Floors</h1>

            <div className="flex gap-4 border-b">
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === 'categories' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categories
                </button>
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === 'floors' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('floors')}
                >
                    Floors
                </button>
            </div>

            {activeTab === 'categories' ? <CategoriesManager /> : <FloorsManager />}
        </div>
    );
}

function CategoriesManager() {
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory }),
            });

            if (res.ok) {
                setNewCategory("");
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create category");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="catName">Category Name</Label>
                            <Input
                                id="catName"
                                placeholder="e.g. Electronics"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Category"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {fetchLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Name</th>
                                        <th className="p-3 text-left font-medium">Slug</th>
                                        <th className="p-3 text-left font-medium">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-gray-500">
                                                No categories found.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((cat) => (
                                            <tr key={cat._id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="p-3 font-medium">{cat.name}</td>
                                                <td className="p-3 text-gray-500">{cat.slug}</td>
                                                <td className="p-3 text-gray-500">
                                                    {new Date(cat.createdAt).toLocaleDateString()}
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

function FloorsManager() {
    const [floors, setFloors] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: "", level: "" });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const fetchFloors = async () => {
        try {
            const res = await fetch("/api/floors");
            const data = await res.json();
            setFloors(data.floors || []);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchFloors();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/floors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, level: Number(formData.level) }),
            });

            if (res.ok) {
                setFormData({ name: "", level: "" });
                fetchFloors();
            } else {
                const data = await res.json();
                alert(data.error || "Failed");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Floor</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="floorName">Floor Name</Label>
                            <Input
                                id="floorName"
                                placeholder="e.g. Ground Floor"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-32 space-y-2">
                            <Label htmlFor="floorLevel">Level</Label>
                            <Input
                                id="floorLevel"
                                type="number"
                                placeholder="0"
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Floor"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Floors</CardTitle>
                </CardHeader>
                <CardContent>
                    {fetchLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Level</th>
                                        <th className="p-3 text-left font-medium">Name</th>
                                        <th className="p-3 text-left font-medium">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {floors.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-gray-500">
                                                No floors found.
                                            </td>
                                        </tr>
                                    ) : (
                                        floors.map((floor) => (
                                            <tr key={floor._id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="p-3 font-medium">{floor.level}</td>
                                                <td className="p-3 text-gray-700">{floor.name}</td>
                                                <td className="p-3 text-gray-500">
                                                    {new Date(floor.createdAt).toLocaleDateString()}
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
