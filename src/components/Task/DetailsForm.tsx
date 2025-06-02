'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { TaskFormData } from './CreateTaskPage';
import Image from 'next/image';

interface ImageItem {
    id: string;
    file: File;
    previewUrl: string;
    uploadedUrl?: string;
    status: 'pending' | 'uploading' | 'uploaded' | 'failed';
}

export default function DetailsForm({ data, onBack, onNext }: {
    data: TaskFormData;
    onBack: () => void;
    onNext: (data: Partial<TaskFormData>) => void;
}) {
    const [description, setDescription] = useState(data.description || '');
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState<{ description?: string }>({});
    const [waitingForUploads, setWaitingForUploads] = useState(false);

    // Track existing images to avoid deleting them
    const existingImageUrls = useRef(data.imageUrls || []);

    // Initialize images state with existing data
    const [images, setImages] = useState<ImageItem[]>(() => {
        if (data.imageUrls && data.imageUrls.length > 0) {
            return data.imageUrls.map(url => ({
                id: `existing-${url}`,
                file: new File([], 'existing-image'),
                previewUrl: url,
                uploadedUrl: url,
                status: 'uploaded' as const
            }));
        }
        return [];
    });

    // Handle new images added via input or drag/drop
    const addNewImages = useCallback((files: FileList | File[]) => {
        const newImages: ImageItem[] = Array.from(files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            previewUrl: URL.createObjectURL(file),
            status: 'pending' as const
        }));

        setImages(prev => [...prev, ...newImages]);
    }, []);

    // Auto-upload pending images
    useEffect(() => {
        const uploadImages = async () => {
            const pendingImages = images.filter(img => img.status === 'pending');

            if (pendingImages.length === 0) return;

            // Process all pending images concurrently
            const uploadPromises = pendingImages.map(async (image) => {
                setImages(prev =>
                    prev.map(img =>
                        img.id === image.id ? { ...img, status: 'uploading' } : img
                    )
                );

                try {
                    const url = await uploadStagedFile(image.file);
                    setImages(prev =>
                        prev.map(img =>
                            img.id === image.id
                                ? { ...img, status: 'uploaded', uploadedUrl: url }
                                : img
                        )
                    );
                } catch (error) {
                    console.error('Error uploading image:', error);
                    setImages(prev =>
                        prev.map(img =>
                            img.id === image.id ? { ...img, status: 'failed' } : img
                        )
                    );
                }
            });

            await Promise.allSettled(uploadPromises);
        };

        uploadImages();
    }, [images]);

    // Clean up object URLs
    useEffect(() => {
        return () => {
            images.forEach(image => {
                if (image.status !== 'uploaded') {
                    URL.revokeObjectURL(image.previewUrl);
                }
            });
        };
    }, [images]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addNewImages(e.target.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) addNewImages(e.dataTransfer.files);
    };

    // Delete image from Cloudinary
    const deleteImageFromCloudinary = async (imageUrl: string) => {
        try {
            await fetch('/services/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const imageToRemove = prev.find(img => img.id === id);
            if (!imageToRemove) return prev;

            // Delete from Cloudinary if it was uploaded in this session
            if (imageToRemove.status === 'uploaded' &&
                imageToRemove.uploadedUrl &&
                !existingImageUrls.current.includes(imageToRemove.uploadedUrl)) {
                deleteImageFromCloudinary(imageToRemove.uploadedUrl);
            }

            // Clean up object URL if not uploaded
            if (imageToRemove.status !== 'uploaded') {
                URL.revokeObjectURL(imageToRemove.previewUrl);
            }

            return prev.filter(img => img.id !== id);
        });
    };

    const uploadStagedFile = async (stagedFile: File | Blob): Promise<string> => {
        const form = new FormData();
        form.append('file', stagedFile);

        const res = await fetch('/services/upload', { method: 'POST', body: form });
        if (!res.ok) throw new Error('Upload failed');
        const json = await res.json();
        return json.imgUrl;
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!description.trim()) newErrors.description = 'Description is required.';
        else if (description.trim().length < 25) newErrors.description = 'Description must be at least 25 characters.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const proceedToNext = useCallback(() => {
        onNext({
            description,
            imageUrls: images
                .filter(img => img.uploadedUrl)
                .map(img => img.uploadedUrl as string)
        });
    }, [description, images, onNext]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Check for active uploads
        const uploadsInProgress = images.some(
            img => img.status === 'pending' || img.status === 'uploading'
        );

        if (uploadsInProgress) {
            setWaitingForUploads(true);
            return;
        }

        proceedToNext();
    };

    // Check when uploads finish after submission
    useEffect(() => {
        if (!waitingForUploads) return;

        const uploadsDone = !images.some(
            img => img.status === 'pending' || img.status === 'uploading'
        );

        if (uploadsDone) {
            proceedToNext();
            setWaitingForUploads(false);
        }
    }, [images, waitingForUploads, proceedToNext]);

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.3
            }
        }),
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <motion.h2
                className="text-xl font-semibold text-slate-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                Tell us more about your task
            </motion.h2>

            <motion.div initial="hidden" animate="visible" custom={0} variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                    Describe what you need done in detail
                </label>
                <Textarea
                    className="min-h-[160px] resize-y border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Detailed description..."
                    value={description}
                    onChange={e => {
                        setDescription(e.target.value);
                        setErrors({});
                    }}
                />
                {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={1} variants={itemVariants}>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                    Upload images (optional)
                </label>
                <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
                        isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image-upload')?.click()}
                >
                    <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-700 font-medium">
                            Drag & drop or click to browse
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            JPG, PNG, GIF (Max 10MB each)
                        </p>
                        <input
                            id="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <Button type="button" variant="outline" className="mt-3">
                            Browse Files
                        </Button>
                    </div>
                </div>

                {images.length > 0 && (
                    <motion.div
                        className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {images.map((image, idx) => (
                            <div
                                key={image.id}
                                className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200"
                            >
                                <Image
                                    src={image.previewUrl}
                                    alt={`Preview ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                {/* Status overlay */}
                                {image.status !== 'uploaded' && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        {image.status === 'uploading' && (
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        )}
                                        {image.status === 'failed' && (
                                            <span className="text-red-500 text-xs font-medium">Failed</span>
                                        )}
                                    </div>
                                )}

                                {/* Remove button */}
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={e => {
                                            e.stopPropagation();
                                            removeImage(image.id);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                className="flex justify-between pt-4 gap-4"
                initial="hidden"
                animate="visible"
                custom={2}
                variants={itemVariants}
            >
                <Button
                    type="button"
                    onClick={onBack}
                    variant="outline"
                >
                    <ArrowLeft className="mr-2" /> Back
                </Button>
                <Button
                    type="submit"
                    disabled={waitingForUploads}
                >
                    {waitingForUploads ? 'Finishing uploads...' : 'Next'}
                    <ArrowRight className="ml-2" />
                </Button>
            </motion.div>
        </form>
    );
}