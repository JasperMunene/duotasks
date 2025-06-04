'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface Category {
    id: string;
    name: string;
}

const categories: Category[] = [
    { id: 'accupuncture', name: 'Accupuncture' },
    { id: 'acoustic-sound-proofing', name: 'Acoustic Sound Proofing' },
    { id: 'advisory', name: 'Advisory' },
    { id: 'beauty-services', name: 'Beauty Services' },
    { id: 'bicycle-repair', name: 'Bicycle Repair' },
    { id: 'boat-detailing', name: 'Boat Detailing' },
    { id: 'body-art', name: 'Body Art' },
    { id: 'bricklayer', name: 'Bricklayer' },
    { id: 'builder', name: 'Builder' },
    { id: 'building-maintenance', name: 'Building Maintenance Managers' },
    { id: 'car-washing', name: 'Car Washing / Car Cleaning' },
    { id: 'carpenter', name: 'Carpenter' },
    { id: 'ceiling-contractor', name: 'Ceiling Contractor' },
    { id: 'interstate-deliveries', name: 'Interstate Deliveries' },
    { id: 'knitting', name: 'Knitting / Needlecraft' },
    { id: 'labour', name: 'Labour' },
    { id: 'letterbox', name: 'Letterbox & Flyer Distribution' },
    { id: 'locksmiths', name: 'Locksmiths' },
    { id: 'market-research', name: 'Market Research' },
    { id: 'massage-therapy', name: 'Massage Therapy' },
    { id: 'childcare', name: 'Maternity, Childcare & Babysitting' },
    { id: 'mechanic', name: 'Mechanic' },
    { id: 'meditation', name: 'Meditation Teacher' },
    { id: 'mentoring', name: 'Mentoring' },
    { id: 'mining', name: 'Mining Activities' },
    { id: 'mobile-language', name: 'Mobile Language Lessons' },
];

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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelected);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleCategory = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
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
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-600 hover:text-emerald-700"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            <ScrollArea className="h-[400px] p-4">
                <div className="space-y-2">
                    {filteredCategories.map((category) => (
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
            </ScrollArea>

            <div className="p-4 border-t border-slate-200 flex justify-between">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="text-slate-600 hover:text-slate-900"
                >
                    Cancel
                </Button>
                <div className="flex gap-2">
                    <Button onClick={() => onApply(selectedCategories)}>
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );
}