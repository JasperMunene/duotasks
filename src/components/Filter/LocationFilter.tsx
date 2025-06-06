'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LocationFilterProps {
    onApply: (data: {
        type: 'in-person' | 'remotely' | 'all';
        town: string;
        distance: number;
    }) => void;
    onCancel: () => void;
    initialValues?: {
        type: 'in-person' | 'remotely' | 'all';
        town: string;
        distance: number;
    };
}

export default function LocationFilter({
                                           onApply,
                                           onCancel,
                                           initialValues = {
                                               type: 'all',
                                               town: '',
                                               distance: 100,
                                           },
                                       }: LocationFilterProps) {
    const [locationType, setLocationType] = useState<'in-person' | 'remotely' | 'all'>(initialValues.type);
    const [town, setTown] = useState(initialValues.town);
    const [distance, setDistance] = useState(initialValues.distance);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const debounceRef = useRef<number | undefined>(undefined);


    const fetchSuggestions = async (query: string) => {
        if (!query.trim()) return;

        setIsLoading(true);
        setApiError(null);

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
                new URLSearchParams({
                    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
                    country: 'ke',
                    types: 'place',
                    autocomplete: 'true',
                    limit: '5'
                })
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const townSuggestions = data.features.map((feature: any) => {
                // Extract only the town name from place_name (e.g. "Nairobi, Kenya" -> "Nairobi")
                return feature.text || feature.place_name.split(',')[0];
            });

            setSuggestions(townSuggestions);
            setShowSuggestions(true);
        } catch (error) {
            console.error('API error:', error);
            setApiError('Failed to fetch town suggestions');
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTown(value);
        setApiError(null);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (value.trim().length > 1) {
            debounceRef.current = window.setTimeout(() => fetchSuggestions(value), 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setTown(suggestion);
        setShowSuggestions(false);
    };

    const handleApply = () => {
        onApply({
            type: locationType,
            town,
            distance,
        });
    };

    return (
        <div className="w-[400px] bg-white rounded-lg">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">LOCATION FILTER</h3>
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
                {/* Town Input with Suggestions */}
                <div className="space-y-2 relative">
                    <label className="text-sm font-medium text-slate-700">Town</label>
                    <div className="relative">
                        <Input
                            type="text"
                            value={town}
                            onChange={handleInputChange}
                            className="w-full pr-10"
                            placeholder="Nairobi, Mombasa, Nakuru..."
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                            </div>
                        )}
                    </div>



                    {apiError && (
                        <div className="text-red-500 text-xs mt-1">
                            {apiError}
                        </div>
                    )}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 cursor-pointer hover:bg-slate-100 text-sm"
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                    {showSuggestions && suggestions.length === 0 && town.length > 1 && !isLoading && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg px-4 py-2 text-sm text-slate-500">
                            No major Kenyan towns found
                        </div>
                    )}
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
                    <p className="text-xs text-slate-500">
                        Distance applies only to in-person locations
                    </p>
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