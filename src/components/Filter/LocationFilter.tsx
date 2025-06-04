'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface LocationFilterProps {
    onApply: (data: {
        type: 'in-person' | 'remotely' | 'all';
        suburb: string;
        distance: number;
    }) => void;
    onCancel: () => void;
    initialValues?: {
        type: 'in-person' | 'remotely' | 'all';
        suburb: string;
        distance: number;
    };
}

export default function LocationFilter({
                                           onApply,
                                           onCancel,
                                           initialValues = {
                                               type: 'all',
                                               suburb: '',
                                               distance: 100,
                                           },
                                       }: LocationFilterProps) {
    const [locationType, setLocationType] = useState<'in-person' | 'remotely' | 'all'>(
        initialValues.type
    );
    const [suburb, setSuburb] = useState(initialValues.suburb);
    const [distance, setDistance] = useState(initialValues.distance);

    const handleApply = () => {
        onApply({
            type: locationType,
            suburb,
            distance,
        });
    };

    return (
        <div className="w-[400px] bg-white rounded-lg">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-emerald-900">TO BE DONE</h3>
            </div>

            <div className="p-4 space-y-6">
                {/* Location Type Selection */}
                <div className="flex gap-2">
                    {[
                        { id: 'in-person', label: 'In-person' },
                        { id: 'remotely', label: 'Remotely' },
                        { id: 'all', label: 'All' },
                    ].map((type) => (
                        <Button
                            key={type.id}
                            variant="outline"
                            onClick={() => setLocationType(type.id as typeof locationType)}
                            className={cn(
                                'flex-1',
                                locationType === type.id
                                    ? 'bg-emerald-600 text-white p-4'
                                    : 'bg-white hover:bg-slate-50 p-4'
                            )}
                        >
                            {type.label}
                        </Button>
                    ))}
                </div>

                {/* Suburb Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">SUBURB</label>
                    <Input
                        placeholder="Enter suburb"
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Distance Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">DISTANCE</label>
                        <span className="text-sm text-slate-600">{distance}km+</span>
                    </div>
                    <Slider
                        value={[distance]}
                        onValueChange={(values) => setDistance(values[0])}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    />
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