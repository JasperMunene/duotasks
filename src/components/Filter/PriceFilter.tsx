'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PriceFilterProps {
    onApply: (range: { min: number; max: number | null }) => void;
    onCancel: () => void;
    initialValues?: { min: number; max: number | null };
}

export default function PriceFilter({
                                        onApply,
                                        onCancel,
                                        initialValues = { min: 0, max: null },
                                    }: PriceFilterProps) {
    const [priceRange, setPriceRange] = useState<number[]>([initialValues.min, initialValues.max || 1000]);
    const [isNoLimit, setIsNoLimit] = useState(initialValues.max === null);

    const formatPrice = (value: number) => {
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}k`;
        }
        return `$${value}`;
    };

    const handleApply = () => {
        onApply({
            min: priceRange[0],
            max: isNoLimit ? null : priceRange[1],
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
                        {isNoLimit ? '∞' : formatPrice(priceRange[1])}
                    </div>
                </div>

                {/* Price Slider */}
                <div className="pt-4">
                    <Slider
                        value={priceRange}
                        onValueChange={(values) => setPriceRange(values)}
                        min={0}
                        max={1000}
                        step={50}
                        disabled={isNoLimit}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    />
                    <div className="flex justify-between mt-2 text-sm text-slate-600">
                        <span>$0</span>
                        <span>$1,000+</span>
                    </div>
                </div>

                {/* No Limit Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isNoLimit}
                        onChange={(e) => setIsNoLimit(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">No maximum price</span>
                </label>
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