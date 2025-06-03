'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import TaskAndDateForm from '@/components/Task/TaskAndDateForm';
import LocationForm from '@/components/Task/LocationForm';
import DetailsForm from '@/components/Task/DetailsForm';
import BudgetForm from '@/components/Task/BudgetForm';
import ReviewForm from '@/components/Task/ReviewForm';

// Define step types for better type safety
export type StepType = 1 | 2 | 3 | 4 | 5;

// Define task data structure
export interface TaskFormData {
    title: string;
    date: string;
    dateMode?: 'on' | 'before' | 'flexible';
    timeSlot?: 'morning' | 'midday' | 'afternoon' | 'evening';
    location: string;
    locationType: 'in-person' | 'online';
    description: string;
    images?: File[];
    imageUrls?: string[];
    budget: string;
    latitude?: number;
    longitude?: number;

}

export default function CreateTaskPage() {
    const [step, setStep] = useState<StepType>(1);
    const [formData, setFormData] = useState<TaskFormData>({
        title: 'Fix my leaking tap',
        date: '2025-06-01',
        dateMode: 'on',
        timeSlot: 'morning',
        location: '',
        locationType: 'in-person',
        description: 'The kitchen tap is leaking and needs fixing.',
        images: [],
        budget: '120',
    });

    const updateFormData = (data: Partial<TaskFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const steps = [
        { id: 1, label: 'Title & Date' },
        { id: 2, label: 'Location' },
        { id: 3, label: 'Details' },
        { id: 4, label: 'Budget' },
        { id: 5, label: 'Review' },
    ];

    const handleNext = (newData?: Partial<TaskFormData>) => {
        console.log('going to step', step + 1);
        if (newData) {
            updateFormData(newData);
        }
        setStep(prev => (prev < 5 ? (prev + 1) as StepType : prev));
    };

    const handleBack = () => {
        setStep(prev => (prev > 1 ? (prev - 1) as StepType : prev));
    };

    // Determine which form to show based on the current step
    const renderForm = () => {
        switch (step) {
            case 1:
                return <TaskAndDateForm data={formData} onNext={handleNext} />;
            case 2:
                return <LocationForm data={formData} onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <DetailsForm data={formData} onNext={handleNext} onBack={handleBack} />;
            case 4:
                return <BudgetForm data={formData} onNext={handleNext} onBack={handleBack} />;
            case 5:
                return <ReviewForm data={formData} onBack={handleBack} onPublish={() => alert('Task published!')} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-80 bg-white p-8 border-r border-slate-200 shadow-sm">
                <div className="w-full">
                    <Link href="/" className="flex items-center">
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Duotasks</span>
                    </Link>

                    <nav className="mt-12 space-y-1">
                        {steps.map((item, i) => (
                            <div key={item.label} className="relative">
                                <div className="flex items-center py-3">
                                    <motion.div
                                        className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold mr-4 transition-all duration-300",
                                            step === item.id
                                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                                : step > item.id
                                                    ? "bg-emerald-50 text-emerald-800"
                                                    : "bg-slate-100 text-slate-500"
                                        )}
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: step === item.id ? 1.1 : 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {i + 1}
                                    </motion.div>
                                    <span
                                        className={cn(
                                            "text-sm font-medium transition-colors duration-200",
                                            step === item.id
                                                ? "text-emerald-700 font-semibold"
                                                : step > item.id
                                                    ? "text-emerald-600"
                                                    : "text-slate-500"
                                        )}
                                    >
                    {item.label}
                  </span>
                                </div>
                                {i < 4 && (
                                    <div
                                        className={cn(
                                            "absolute left-5 top-12 bottom-0 w-[2px] transition-colors duration-300",
                                            step > item.id ? "bg-emerald-400" : "bg-slate-200"
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-12 relative">
                {/* Mobile Progress Indicator */}
                <div className="flex lg:hidden justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <span className="font-medium text-emerald-700">Step {step} of 5</span>
                    <div className="w-2/3 bg-slate-200 rounded-full h-2">
                        <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / 5) * 100}%` }}
                        />
                    </div>
                </div>

                <Link href="/discover" className="absolute top-6 right-6 z-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-emerald-50 hover:text-emerald-600 border-emerald-200 transition-all duration-300"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </Link>

                <motion.div
                    className="max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="mb-8">
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                            {step <= 2
                                ? "Let's start with the basics"
                                : step < 5
                                    ? "More details to help us help you"
                                    : "Ready to publish your task"}
                        </h1>
                        <p className="text-slate-600 leading-relaxed">
                            {step <= 2
                                ? "Tell us what you need done, and we'll help you find the right person for the job."
                                : step < 5
                                    ? "Now let's add all the details needed to help taskers understand your needs."
                                    : "Review everything before posting your task to our community."}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderForm()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}