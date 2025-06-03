'use client';

import {Button} from "@/components/ui/button";
import {ArrowLeft, ArrowRight} from "lucide-react";
import React from "react";

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
        latitude: string;
        longitude: string;
        imageUrls: string[];
    };
    onBack: () => void;
    onPublish: () => void;
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900">Review your task</h2>
            <p className="text-gray-600">Make sure everything looks good before posting.</p>

            <div className="space-y-4">
                <ReviewItem label="Title" value={data.title} />
                <ReviewItem label="Date" value={data.date} />
                <ReviewItem label="Location" value={data.location} />
                <ReviewItem label="Description" value={data.description} />
                <ReviewItem label="Budget" value={`KES ${data.budget}`} />
            </div>

            <div className="flex justify-between pt-6">
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
                    onClick={onPublish}
                    className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white group transition-all duration-200 shadow-sm hover:shadow"
                >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
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
