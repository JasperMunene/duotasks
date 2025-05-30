'use client';

import { useState } from 'react';
import { MapPin, Smartphone, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TaskFormData } from './CreateTaskPage';

export default function LocationForm({
                                         data,
                                         onBack,
                                         onNext
                                     }: {
    data: TaskFormData;
    onBack: () => void;
    onNext: (data: Partial<TaskFormData>) => void;
}) {
    const [locationType, setLocationType] = useState<'in-person' | 'online'>(data.locationType || 'in-person');
    const [location, setLocation] = useState(data.location || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (locationType === 'in-person' && !location.trim()) {
            return; // Add form validation as needed
        }

        onNext({
            location: locationType === 'in-person' ? location : 'Online',
            locationType
        });
    };

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

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.h2
                className="text-xl font-semibold text-slate-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                Where will this task take place?
            </motion.h2>

            {/* Toggle Buttons */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={itemVariants}
            >
                <Button
                    type="button"
                    onClick={() => setLocationType('in-person')}
                    variant="outline"
                    className={cn(
                        "h-auto flex flex-col items-center py-6 px-4 space-y-3 transition-all duration-200",
                        locationType === 'in-person'
                            ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200 text-emerald-700"
                            : "bg-white hover:bg-emerald-50 text-slate-600"
                    )}
                >
                    <MapPin className={cn(
                        "h-10 w-10 p-2 rounded-full transition-colors",
                        locationType === 'in-person' ? "bg-emerald-100 text-emerald-600" : "bg-emerald-50 text-slate-500"
                    )} />
                    <span className="font-medium text-base">In-person</span>
                    <span className="text-xs text-center max-w-[200px]">
            Select this if you need the Tasker physically there
          </span>
                </Button>

                <Button
                    type="button"
                    onClick={() => setLocationType('online')}
                    variant="outline"
                    className={cn(
                        "h-auto flex flex-col items-center py-6 px-4 space-y-3 transition-all duration-200",
                        locationType === 'online'
                            ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200 text-emerald-700"
                            : "bg-white hover:bg-emerald-50 text-slate-600"
                    )}
                >
                    <Smartphone className={cn(
                        "h-10 w-10 p-2 rounded-full transition-colors",
                        locationType === 'online' ? "bg-emerald-100 text-emerald-600" : "bg-emerald-50 text-slate-500"
                    )} />
                    <span className="font-medium text-base">Online</span>
                    <span className="text-xs text-center max-w-[200px]">
            Select this if the Tasker can do it from home
          </span>
                </Button>
            </motion.div>

            {/* Location Input */}
            {locationType === 'in-person' && (
                <motion.div
                    className="space-y-3"
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
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-10 py-5 h-12 border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Enter location (e.g. Sydney CBD)"
                        />
                        {location && (
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setLocation('')}
                            >
                <span className="text-slate-400 hover:text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </span>
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Buttons */}
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