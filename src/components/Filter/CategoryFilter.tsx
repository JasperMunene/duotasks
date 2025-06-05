'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCategories } from '@/services/categoryService';
import { Category } from '@/types';

interface CategoryFilterProps {
    onApply: (selectedCategories: string[]) => void;
    onCancel: () => void;
    initialSelected?: string[];
}

export default function CategoryFilter({
                                           onApply,
                                           onCancel,
                                           initialSelected = [],
                                       }: CategoryFilterProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelected);

    // Fetch categories from API
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError('Failed to load categories. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleRetry = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load categories. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-[400px] bg-white rounded-lg">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">ALL CATEGORIES</h3>
                <div className="mt-2 relative">
                    <Input
                        type="text"
                        placeholder="Search categories"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-slate-50"
                        disabled={isLoading || !!error}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-600 hover:text-emerald-700"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <ScrollArea className="h-[400px]">
                <div className="p-4">
                    {isLoading ? (
                        <div className="space-y-2">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-[360px] text-center p-4">
                            <p className="text-red-500 mb-3">{error}</p>
                            <Button variant="outline" onClick={handleRetry}>
                                Retry
                            </Button>
                        </div>
                    ) : filteredCategories.length > 0 ? (
                        <div className="space-y-2">
                            {filteredCategories.map(category => (
                                <div key={category.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category.id}
                                        checked={selectedCategories.includes(category.id)}
                                        onCheckedChange={() => handleToggleCategory(category.id)}
                                    />
                                    <label
                                        htmlFor={category.id}
                                        className="text-sm text-slate-700 cursor-pointer"
                                    >
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[360px] text-slate-500">
                            No categories found
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-200 flex justify-between">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="text-slate-600 hover:text-slate-900"
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => onApply(selectedCategories)}
                    disabled={isLoading || !!error}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}