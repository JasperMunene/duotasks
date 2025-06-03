'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { TaskFormData } from './CreateTaskPage';

type DateMode = 'on' | 'before' | 'flexible';
type TimeSlot = 'morning' | 'midday' | 'afternoon' | 'evening';

const popularTasks = [
    'House Cleaning',
    'Furniture Assembly',
    'Home Moving',
    'Handyman',
    'Gardening',
    'Painting',
];

export default function TaskAndDateForm({
                                            data,
                                            onNext,
                                        }: {
    data: TaskFormData;
    onNext: (data: Partial<TaskFormData>) => void;
}) {
    const [taskTitle, setTaskTitle] = useState(data.title || '');
    const [dateMode, setDateMode] = useState<DateMode>(data.dateMode || 'on');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        data.date ? new Date(data.date) : undefined
    );
    const [timeSlot, setTimeSlot] = useState<TimeSlot>(data.timeSlot || 'morning');
    const [needTimeSlot, setNeedTimeSlot] = useState(Boolean(data.timeSlot));

    const [errors, setErrors] = useState<{
        title?: string;
        dateMode?: string;
        date?: string;
    }>({});

    const timeOptions = [
        { key: 'morning', label: 'Morning', time: 'Before 10 AM', icon: '🌅' },
        { key: 'midday', label: 'Midday', time: '10 AM – 2 PM', icon: '☀️' },
        { key: 'afternoon', label: 'Afternoon', time: '2 PM – 6 PM', icon: '🌤️' },
        { key: 'evening', label: 'Evening', time: 'After 6 PM', icon: '🌙' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};

        if (!taskTitle.trim()) newErrors.title = 'Please enter a task title.';
        if (!dateMode) newErrors.dateMode = 'Please choose when you need it done.';
        if ((dateMode === 'on' || dateMode === 'before') && !selectedDate) {
            newErrors.date = 'Please select a date.';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const formattedDate = selectedDate
            ? format(selectedDate, 'yyyy-MM-dd')
            : '';

        const payload: Partial<TaskFormData> = {
            title: taskTitle,
            date: formattedDate,
            dateMode,
        };

        if (dateMode === 'flexible' && needTimeSlot) {
            payload.timeSlot = timeSlot;
        }

        onNext(payload);
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
        <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            {/* Task Title */}
            <motion.div
                initial="hidden"
                animate="visible"
                custom={0}
                variants={itemVariants}
                className="space-y-4"
            >
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                    What do you need done?
                </label>
                <Input
                    id="title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Help move my sofa"
                    className="h-12 text-lg transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                />
                {errors.title && <p className="text-sm text-emerald-600 mt-1">{errors.title}</p>}

                <div className="flex flex-wrap gap-2 mt-2">
                    {popularTasks.map((task, i) => (
                        <motion.div
                            key={task}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.2 }}
                        >
                            <Badge
                                variant="outline"
                                className="cursor-pointer bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300 transition-all duration-200 px-3 py-1 text-sm"
                                onClick={() => setTaskTitle(task)}
                            >
                                {task}
                            </Badge>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Date Selection */}
            <motion.div
                initial="hidden"
                animate="visible"
                custom={1}
                variants={itemVariants}
                className="space-y-4"
            >
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-lg font-medium text-slate-800">
                        When do you need it done?
                    </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                    {[
                        { mode: 'on', label: 'On a specific date' },
                        { mode: 'before', label: 'Before a date' },
                        { mode: 'flexible', label: "I'm flexible" },
                    ].map((option, i) => (
                        <motion.div
                            key={option.mode}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                        >
                            <Button
                                type="button"
                                variant={dateMode === option.mode ? 'default' : 'outline'}
                                className={cn(
                                    'px-4 py-2 rounded-full transition-all duration-200',
                                    dateMode === option.mode
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-emerald-700 border-slate-200'
                                )}
                                onClick={() => {
                                    setDateMode(option.mode as DateMode);
                                    if (option.mode !== 'flexible') {
                                        setNeedTimeSlot(false);
                                        setSelectedDate(undefined);
                                    }
                                }}
                            >
                                {option.label}
                            </Button>
                        </motion.div>
                    ))}
                </div>
                {errors.dateMode && <p className="text-sm text-emerald-600 mt-1">{errors.dateMode}</p>}

                {(dateMode === 'on' || dateMode === 'before') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal h-12',
                                        !selectedDate && 'text-slate-500'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.date && <p className="text-sm text-emerald-500 mt-2">{errors.date}</p>}
                    </motion.div>
                )}

                {dateMode === 'flexible' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center space-x-2">
                            <input
                                id="flexible-time"
                                type="checkbox"
                                checked={needTimeSlot}
                                onChange={() => setNeedTimeSlot((prev) => !prev)}
                                className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="flexible-time" className="text-sm text-slate-700 font-medium">
                                I need a certain time of day
                            </label>
                        </div>

                        {needTimeSlot && (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {timeOptions.map((option, i) => (
                                    <motion.div
                                        key={option.key}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1, duration: 0.2 }}
                                    >
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={cn(
                                                'h-auto w-full py-3 justify-start space-x-3 transition-all duration-200',
                                                timeSlot === option.key
                                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                                            )}
                                            onClick={() => setTimeSlot(option.key as TimeSlot)}
                                        >
                                            <span className="text-xl">{option.icon}</span>
                                            <div className="text-left">
                                                <div className="font-medium">{option.label}</div>
                                                <div className="text-xs text-slate-500">{option.time}</div>
                                            </div>
                                        </Button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Next Button */}
            <motion.div
                initial="hidden"
                animate="visible"
                custom={3}
                variants={itemVariants}
                className="pt-6 border-t border-slate-200"
            >
                <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow group"
                >
                    <span>Next: Choose Location</span>
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
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </Button>
            </motion.div>
        </form>
    );
}
