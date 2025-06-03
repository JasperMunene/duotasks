'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Smartphone, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TaskFormData } from './CreateTaskPage';

// Google Maps types
declare global {
    interface Window {
        google: any;
    }
}

type Suggestion = { description: string; place_id: string };

export default function LocationForm({ data, onBack, onNext }: {
    data: TaskFormData;
    onBack: () => void;
    onNext: (data: Partial<TaskFormData>) => void;
}) {
    const [locationType, setLocationType] = useState<'in-person' | 'online'>(data.locationType || 'in-person');
    const [location, setLocation] = useState(data.location || '');
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
        data.latitude && data.longitude
            ? { latitude: data.latitude, longitude: data.longitude }
            : null
    );
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const debounceRef = useRef<number | undefined>(undefined);
    const [errors, setErrors] = useState<{ location?: string }>({});
    const autocompleteServiceRef = useRef<any>(null);
    const geocoderRef = useRef<any>(null);
    const [googleLoaded, setGoogleLoaded] = useState(false);

    const modes = ['in-person', 'online'] as const;

    // Initialize Google services
    useEffect(() => {
        if (window.google && window.google.maps) {
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
            geocoderRef.current = new window.google.maps.Geocoder();
            setGoogleLoaded(true);
            return;
        }

        if (!document.querySelector('#google-maps-script')) {
            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            script.onload = () => {
                autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
                geocoderRef.current = new window.google.maps.Geocoder();
                setGoogleLoaded(true);
            };
        }
    }, []);

    const fetchSuggestions = useCallback((query: string) => {
        if (!autocompleteServiceRef.current || !googleLoaded) return;

        autocompleteServiceRef.current.getPlacePredictions(
            {
                input: query,
                componentRestrictions: { country: 'ke' },
                types: ['geocode', 'establishment']
            },
            (predictions: any[] | null, status: string) => {
                if (status !== 'OK' || !predictions) {
                    setSuggestions([]);
                    setShowDropdown(false);
                    return;
                }

                const mapped: Suggestion[] = predictions.map(p => ({
                    description: p.description,
                    place_id: p.place_id
                }));
                setSuggestions(mapped);
                setShowDropdown(true);
            }
        );
    }, [googleLoaded]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocation(val);
        setCoords(null);
        setErrors({});
        window.clearTimeout(debounceRef.current);
        if (val.trim().length > 2) {
            debounceRef.current = window.setTimeout(() => fetchSuggestions(val), 300);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSelect = (s: Suggestion) => {
        if (!geocoderRef.current) return;

        geocoderRef.current.geocode({ placeId: s.place_id }, (results: any[] | null, status: string) => {
            if (status === 'OK' && results?.[0]) {
                const location = results[0].geometry.location;
                setLocation(s.description);
                setCoords({
                    latitude: location.lat(),
                    longitude: location.lng()
                });
                setShowDropdown(false);
                setErrors({});
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};
        if (locationType === 'in-person') {
            if (!location.trim()) {
                newErrors.location = 'Please enter a location.';
            } else if (!coords) {
                newErrors.location = 'Please select a valid location from suggestions.';
            }
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;
        onNext({
            location: locationType === 'in-person' ? location : 'Online',
            locationType,
            latitude: coords?.latitude,
            longitude: coords?.longitude,
        });
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.3 },
        }),
    };

    return (
        <form className="space-y-6 relative" onSubmit={handleSubmit} noValidate>
            <motion.h2
                className="text-xl font-semibold text-slate-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                Where will this task take place?
            </motion.h2>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={itemVariants}
            >
                {modes.map((mode) => {
                    const isInPerson = mode === 'in-person';
                    return (
                        <Button
                            key={mode}
                            type="button"
                            onClick={() => setLocationType(mode)}
                            variant="outline"
                            className={cn(
                                'max-w-full h-auto flex flex-col items-center py-6 px-4 transition-all duration-200',
                                locationType === mode
                                    ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200 text-emerald-700'
                                    : 'bg-white hover:bg-emerald-50 text-slate-600'
                            )}
                        >
                            {isInPerson ? (
                                <MapPin
                                    className={cn(
                                        'h-10 w-10 p-2 rounded-full transition-colors',
                                        locationType === mode
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-emerald-50 text-slate-500'
                                    )}
                                />
                            ) : (
                                <Smartphone
                                    className={cn(
                                        'h-10 w-10 p-2 rounded-full transition-colors',
                                        locationType === mode
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-emerald-50 text-slate-500'
                                    )}
                                />
                            )}
                            <span className="font-medium text-base mt-2">
                                {isInPerson ? 'In-person' : 'Online'}
                            </span>
                            <span className="text-xs text-center max-w-[180px] whitespace-normal break-words">
                                {isInPerson
                                    ? 'Select this if you need the Tasker physically there'
                                    : 'Select this if the Tasker can do it from home'}
                            </span>
                        </Button>
                    );
                })}
            </motion.div>

            {locationType === 'in-person' && (
                <motion.div
                    className="space-y-3 relative"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <label className="block text-sm font-medium text-slate-700">
                        Where do you need this done?
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            type="text"
                            value={location}
                            onChange={onInputChange}
                            className="pl-10 py-5 h-12 border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Enter location in Kenya"
                            onFocus={() => location.trim().length > 2 && setShowDropdown(true)}
                        />
                        {location && (
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => { setLocation(''); setCoords(null); setSuggestions([]); }}
                            >
                                <span className="text-slate-400 hover:text-slate-500">✕</span>
                            </button>
                        )}
                        {showDropdown && suggestions.length > 0 && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto"
                            >
                                {suggestions.map((s, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelect(s)}
                                        className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-slate-700"
                                    >
                                        {s.description}
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
                    </div>
                </motion.div>
            )}

            <motion.div
                className="flex justify-between pt-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <Button
                    type="button"
                    onClick={onBack}
                    variant="outline"
                    className="px-6 group transition-all duration-200 border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back
                </Button>
                <Button
                    type="submit"
                    className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white group transition-all duration-200 shadow-sm hover:shadow"
                >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
            </motion.div>
        </form>
    );
}