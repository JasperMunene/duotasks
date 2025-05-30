'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { TaskFormData } from './CreateTaskPage';

export default function BudgetForm({
                                       data,
                                       onBack,
                                       onNext,
                                   }: {
    data: TaskFormData;
    onBack: () => void;
    onNext: (data: Partial<TaskFormData>) => void;
}) {
    const [budget, setBudget] = useState(data.budget || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (budget.trim() === '' || isNaN(Number(budget))) {
            return; // Add form validation as needed
        }

        onNext({ budget });
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.3,
            },
        }),
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.h2
                className="text-xl font-semibold text-slate-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                What is your budget?
            </motion.h2>

            {/* Budget Amount */}
            <motion.div
                initial="hidden"
                animate="visible"
                custom={1}
                variants={itemVariants}
                className="space-y-2"
            >
                <div className="flex items-center justify-between">
                    <Label htmlFor="budget" className="text-sm font-medium text-slate-700">
                        Budget amount (KES)
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                        <path d="M12 17h.01" />
                                    </svg>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-[200px] text-xs">
                                    Enter the total amount you are willing to pay for this task.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <h2>KES</h2>
                    </div>
                    <Input
                        type="number"
                        id="budget"
                        min={0}
                        placeholder="150"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="pl-10 h-12 border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                </div>
            </motion.div>

            {/* Budget Tips */}
            <motion.div
                className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <div className="flex items-start space-x-3">
                    <CreditCard className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-emerald-800">Budget tips</h4>
                        <p className="text-emerald-700 mt-1 leading-relaxed">
                            Setting a realistic budget increases your chances of finding the right person.
                            Consider the complexity and time required for your task.
                        </p>
                    </div>
                </div>
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
