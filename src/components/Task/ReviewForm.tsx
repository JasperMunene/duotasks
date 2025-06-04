'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { TaskPayload } from "@/types/task";


export default function ReviewForm({
                                       data,
                                       onBack,
                                       onPublish,
                                   }: {
    data: {
        title: string;
        date: string;
        location: string;
        description: string;
        budget: string;
        latitude?: number;
        longitude?: number;
        imageUrls?: string[];
        locationType: 'in-person' | 'online';
        dateMode?: 'on' | 'before' | 'flexible';
        timeSlot?: 'morning' | 'midday' | 'afternoon' | 'evening';
    };
    onBack: () => void;
    onPublish: () => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePublish = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Prepare location details - default to empty strings
            let locationDetails = {
                city: '',
                state: '',
                country: '',
                area: ''
            };

            // Only reverse geocode for in-person tasks with valid coordinates
            if (data.locationType === 'in-person' && data.latitude && data.longitude) {
                locationDetails = await reverseGeocode(data.latitude, data.longitude);
            }

            // Prepare payload according to backend expectations
            const payload: TaskPayload = {
                title: data.title,
                description: data.description,
                work_mode: data.locationType === 'online' ? 'remote' : 'physical',
                budget: parseFloat(data.budget),
                images: data.imageUrls || [],
            };

            // Handle schedule type based on dateMode
            if (data.dateMode) {
                payload.schedule_type =
                    data.dateMode === 'on' ? 'specific_day' :
                        data.dateMode === 'before' ? 'before_day' :
                            'flexible';

                // Convert date to ISO string format if needed
                if (data.date && (data.dateMode === 'on' || data.dateMode === 'before')) {
                    const dateObj = new Date(data.date);
                    if (isNaN(dateObj.getTime())) {
                        throw new Error('Invalid date format');
                    }

                    const iso = dateObj.toISOString().replace(/Z$/, '+00:00');

                    if (data.dateMode === 'on') {
                        payload.specific_date = iso;
                    } else if (data.dateMode === 'before') {
                        payload.deadline_date = iso;
                    }
                }

                // Add preferred time for flexible schedule
                if (data.dateMode === 'flexible' && data.timeSlot) {
                    payload.preferred_time = data.timeSlot;
                }
            }

            // Add location details for physical tasks
            if (data.locationType === 'in-person') {
                payload.latitude = data.latitude;
                payload.longitude = data.longitude;
                payload.city = locationDetails.city;
                payload.state = locationDetails.state;
                payload.country = locationDetails.country;
                payload.area = locationDetails.area;
            }

            console.log("Sending payload:", payload); // Debugging

            // Post to backend
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            // Handle non-2xx responses
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;

                try {
                    // Attempt to parse error response
                    const errorResponse = await response.json();
                    if (errorResponse.message) {
                        // Handle different error message formats
                        if (typeof errorResponse.message === 'string') {
                            errorMessage = errorResponse.message;
                        } else if (Array.isArray(errorResponse.message)) {
                            errorMessage = errorResponse.message.join(', ');
                        } else if (typeof errorResponse.message === 'object') {
                            errorMessage = JSON.stringify(errorResponse.message);
                        }
                    }
                } catch (e) {
                    // If we can't parse JSON, use status text
                    console.error('Failed to parse error response:', e);
                    errorMessage = response.statusText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            onPublish();
        } catch (err) {
            console.error('Publishing failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to publish task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const reverseGeocode = async (lat: number, lng: number): Promise<{
        city: string;
        state: string;
        country: string;
        area: string;
    }> => {
        return new Promise((resolve) => {
            if (!window.google || !window.google.maps) {
                resolve({
                    city: '',
                    state: '',
                    country: '',
                    area: ''
                });
                return;
            }

            const geocoder = new window.google.maps.Geocoder();
            const latLng = new window.google.maps.LatLng(lat, lng);

            geocoder.geocode({ location: latLng }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === google.maps.GeocoderStatus.OK && results !== null &&  results.length > 0) {
                    const addressComponents = results[0].address_components;
                    const details = {
                        city: '',
                        state: '',
                        country: '',
                        area: ''
                    };

                    for (const component of addressComponents) {
                        const types = component.types;

                        if (types.includes('locality')) {
                            details.city = component.long_name;
                        }
                        else if (types.includes('administrative_area_level_1')) {
                            details.state = component.long_name;
                        }
                        else if (types.includes('country')) {
                            details.country = component.long_name;
                        }
                        else if (types.includes('sublocality') || types.includes('neighborhood')) {
                            details.area = component.long_name;
                        }
                    }

                    resolve(details);
                } else {
                    // Instead of rejecting, resolve with empty values
                    resolve({
                        city: '',
                        state: '',
                        country: '',
                        area: ''
                    });
                }
            });
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900">Review your task</h2>
            <p className="text-gray-600">Make sure everything looks good before posting.</p>

            <div className="space-y-4">
                <ReviewItem label="Title" value={data.title} />
                <ReviewItem label="Date"  value={
                    data.dateMode === 'flexible'
                        ? 'Flexible'
                        : (data.date || 'Flexible')
                }
                />
                <ReviewItem label="Location" value={data.location} />
                <ReviewItem label="Description" value={data.description} />
                <ReviewItem label="Budget" value={`KES ${data.budget}`} />
                {data.dateMode === 'flexible' && data.timeSlot && (
                    <ReviewItem label="Preferred Time" value={data.timeSlot} />
                )}
            </div>

            {error && (
                <div className="text-red-500 p-3 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex justify-between pt-6">
                <Button
                    type="button"
                    onClick={onBack}
                    variant="outline"
                    className="px-6 group transition-all duration-200 border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
                    disabled={isSubmitting}
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white group transition-all duration-200 shadow-sm hover:shadow disabled:opacity-70"
                >
                    {isSubmitting ? (
                        'Publishing...'
                    ) : (
                        <>
                            Publish
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <h4 className="text-sm font-medium text-emerald-900">{label}</h4>
            <p className="text-gray-700 bg-gray-100 px-4 py-2 rounded-lg mt-1">{value}</p>
        </div>
    );
}