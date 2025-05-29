'use client';

import { ArrowLeft, CheckCircle2,  MapPin, Calendar, FileText, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useState } from "react";

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { TaskFormData } from './CreateTaskPage';

export default function ReviewForm({
                                       data,
                                       onBack,
                                       onPublish,
                                       onNext,
                                   }: {
    data: TaskFormData;
    onBack: () => void;
    onPublish: () => void;
}) {
    const [location, setLocation] = useState(data.location || '');

    // Format date for display
    const formattedDate = data.date ?
        (typeof data.date === 'string' ?
            format(new Date(data.date), 'MMMM d, yyyy') :
            format(data.date, 'MMMM d, yyyy')) :
        'Flexible';

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.3
            }
        })
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (location.trim() === '') {
            return; // optionally show an error
        }
        onNext({ location }); // ✅ this now works correctly
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2"
            >
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <h2 className="text-xl font-semibold text-slate-800">Almost done!</h2>
            </motion.div>

            <motion.p
                className="text-slate-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                Review your task details before posting.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center justify-between">
                            <span>Task Summary</span>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                {data.locationType === 'in-person' ? 'In-person' : 'Online'}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Title */}
                        <div className="group relative">
                            <div className="flex items-start">
                                <div className="mr-3 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium text-slate-800">Task</h3>
                                    <p className="text-sm text-slate-600">{data.title}</p>
                                </div>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="group relative">
                            <div className="flex items-start">
                                <div className="mr-3 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium text-slate-800">When</h3>
                                    <p className="text-sm text-slate-600">
                                        {formattedDate}
                                        {data.timeSlot && ` (${data.timeSlot.charAt(0).toUpperCase() + data.timeSlot.slice(1)})`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="group relative">
                            <div className="flex items-start">
                                <div className="mr-3 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium text-slate-800">Where</h3>
                                    <p className="text-sm text-slate-600">{data.location}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Description */}
                        <div className="group relative">
                            <div className="flex items-start">
                                <div className="mr-3 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium text-slate-800">Details</h3>
                                    <p className="text-sm text-slate-600">{data.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="group relative">
                            <div className="flex items-start">
                                <div className="mr-3 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium text-slate-800">Budget</h3>
                                    <p className="text-lg font-semibold text-emerald-700">AUD ${data.budget}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
                className="flex justify-between pt-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
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
                    onClick={onPublish}
                    className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 shadow-sm hover:shadow"
                >
                    Post Task
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                    >
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                    </svg>
                </Button>
            </motion.div>
        </div>
    );
}