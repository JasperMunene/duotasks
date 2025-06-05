'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';

interface PriceFilterProps {
    onApply: (range: { min: number; max: number }) => void;
    onCancel: () => void;
    initialValues?: { min: number; max: number | null };
}

export default function PriceFilter({
                                        onApply,
                                        onCancel,
                                        initialValues = { min: 500, max: 100_000 },
                                    }: PriceFilterProps) {
    const upperLimit = initialValues.max ?? 100_000;
    const [priceRange, setPriceRange] = useState<number[]>([
        initialValues.min,
        upperLimit,
    ]);

    const formatPrice = (value: number) => {
        if (value >= 1000) {
            return `KES ${(value / 1000).toFixed(1)}k`;
        }
        return `KES ${value}`;
    };

    const handleApply = () => {
        onApply({
            min: priceRange[0],
            max: priceRange[1],
        });
    };

    return (
        <div className="w-[400px] bg-white rounded-lg">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Price range</h3>
            </div>

            <div className="p-4 space-y-6">
                {/* Price Display */}
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-slate-900">
                        {formatPrice(priceRange[0])}
                    </div>
                    <div className="text-slate-400">to</div>
                    <div className="text-2xl font-semibold text-slate-900">
                        {formatPrice(priceRange[1])}
                    </div>
                </div>

                {/* Price Slider */}
                <div className="pt-4">
                    <DualRangeSlider
                        value={priceRange}
                        onValueChange={(values) => setPriceRange(values)}
                        min={500}
                        max={100_000}
                        step={500}
                        className="relative h-6"
                    />

                    <div className="flex justify-between mt-2 text-sm text-slate-600">
                        <span>KES 500</span>
                        <span>KES 100k</span>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-between">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="text-slate-600 hover:text-slate-900"
                >
                    Cancel
                </Button>
                <Button onClick={handleApply}>Apply</Button>
            </div>
        </div>
    );
}
