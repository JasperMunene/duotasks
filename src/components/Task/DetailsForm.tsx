'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { TaskFormData } from './CreateTaskPage';

export default function DetailsForm({
                                        data,
                                        onBack,
                                        onNext,
                                    }: {
    data: TaskFormData;
    onBack: () => void;
    onNext: (data: Partial<TaskFormData>) => void;
}) {
    const [description, setDescription] = useState(data.description || '');
    const [images, setImages] = useState<File[]>(data.images || []);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            setImages(Array.from(e.dataTransfer.files));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            return; // Add form validation as needed
        }

        onNext({
            description,
            images
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
                Tell us more about your task
            </motion.h2>

            {/* Description Field */}
            <motion.div
                initial="hidden"
                animate="visible"
                custom={0}
                variants={itemVariants}
            >
                <label className="block mb-2 text-sm font-medium text-slate-700">
                    Describe what you need done in detail
                </label>
                <Textarea
                    className="min-h-[160px] resize-y border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400"
                    placeholder="Provide specific details about your task to help taskers understand what you need..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </motion.div>

            {/* Image Upload */}
            <motion.div
                initial="hidden"
                animate="visible"
                custom={1}
                variants={itemVariants}
            >
                <label className="block mb-2 text-sm font-medium text-slate-700">
                    Upload images (optional)
                </label>
                <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-all ${
                        isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-700 font-medium">
                            Drag & drop images here or click to browse
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Supports: JPG, PNG, GIF (Max size: 10MB)
                        </p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-3 bg-white hover:bg-slate-50 border-slate-300"
                            onClick={() => document.getElementById('image-upload')?.click()}
                        >
                            Browse Files
                        </Button>
                    </div>
                </div>

                {images.length > 0 && (
                    <motion.div
                        className="mt-3 flex items-center gap-2 text-sm text-slate-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center">
                            <span>{images.length} file{images.length > 1 ? 's' : ''} selected</span>
                            <button
                                type="button"
                                onClick={() => setImages([])}
                                className="ml-2 text-emerald-600 hover:text-emerald-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Navigation Buttons */}
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