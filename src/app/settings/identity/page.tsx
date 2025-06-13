'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield, Upload, Camera, CheckCircle, AlertCircle, Loader2, Info, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function IdentitySettings() {
    const [documentType, setDocumentType] = useState('');
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [documentPreview, setDocumentPreview] = useState<string | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const [identityStatus, setIdentityStatus] = useState<'pending' | 'verified' | 'rejected' | 'unverified' | 'processing'>('unverified');
    const [showCamera, setShowCamera] = useState(false);
    const [verificationProgress, setVerificationProgress] = useState(0);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionDialog, setShowRejectionDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const documentInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { toast } = useToast();

    // Document upload handler with validation
    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSizeMB = 10;

        if (!validTypes.includes(file.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a JPG, PNG, or PDF file",
                variant: "destructive",
            });
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: `File exceeds ${maxSizeMB}MB limit`,
                variant: "destructive",
            });
            return;
        }

        setDocumentFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setDocumentPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Camera handling with proper cleanup
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setShowCamera(true);
            }
        } catch (error) {
            toast({
                title: "Camera Access Denied",
                description: "Please enable camera permissions in your browser settings",
                variant: "destructive",
            });
        }
    };

    const takeSelfie = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
                        setSelfieFile(file);
                        setSelfiePreview(canvas.toDataURL());
                        closeCamera();
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    };

    // Simulate verification process
    const submitIdentityVerification = async () => {
        setIsProcessing(true);
        setIdentityStatus('processing');

        // Simulate verification steps
        const steps = [
            { label: "Validating documents", duration: 1500 },
            { label: "Checking authenticity", duration: 2000 },
            { label: "Face matching", duration: 2500 },
            { label: "Final verification", duration: 1000 },
        ];

        for (let i = 0; i < steps.length; i++) {
            setVerificationProgress((i + 1) * 25);
            await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        }

        // Simulate verification result (80% success rate)
        const isVerified = Math.random() > 0.2;

        if (isVerified) {
            setIdentityStatus('verified');
            toast({
                title: "Identity Verified",
                description: "Your identity has been successfully verified",
            });
        } else {
            setIdentityStatus('rejected');
            setRejectionReason("Document quality is poor or face doesn't match");
            setShowRejectionDialog(true);
        }

        setIsProcessing(false);
        setVerificationProgress(0);
    };

    // Camera cleanup
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    Identity Verification
                </h1>
                <p className="text-slate-600 mt-1 text-sm md:text-base">
                    Verify your identity to build trust and unlock all platform features.
                </p>
            </div>

            {/* Verification Status */}
            <div className={`mb-6 p-4 rounded-lg border ${
                identityStatus === 'verified'
                    ? 'bg-emerald-50 border-emerald-200'
                    : identityStatus === 'processing'
                        ? 'bg-blue-50 border-blue-200'
                        : identityStatus === 'pending'
                            ? 'bg-yellow-50 border-yellow-200'
                            : identityStatus === 'rejected'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-slate-50 border-slate-200'
            }`}>
                <div className="flex items-center gap-2">
                    {identityStatus === 'verified' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    {identityStatus === 'processing' && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                    {identityStatus === 'pending' && <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />}
                    {identityStatus === 'rejected' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {identityStatus === 'unverified' && <Info className="w-5 h-5 text-slate-600" />}
                    <div>
                        <p className={`font-medium ${
                            identityStatus === 'verified'
                                ? 'text-emerald-700'
                                : identityStatus === 'processing'
                                    ? 'text-blue-700'
                                    : identityStatus === 'pending'
                                        ? 'text-yellow-700'
                                        : identityStatus === 'rejected'
                                            ? 'text-red-700'
                                            : 'text-slate-700'
                        }`}>
                            {identityStatus === 'verified' && 'Identity Verified'}
                            {identityStatus === 'processing' && 'Verification in Progress'}
                            {identityStatus === 'pending' && 'Verification Pending'}
                            {identityStatus === 'rejected' && 'Verification Rejected'}
                            {identityStatus === 'unverified' && 'Identity Not Verified'}
                        </p>
                        {identityStatus === 'rejected' && (
                            <p className="text-sm text-red-600 mt-1">
                                {rejectionReason}
                                <button
                                    onClick={() => setShowRejectionDialog(true)}
                                    className="ml-2 text-blue-600 hover:underline"
                                >
                                    View details
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {identityStatus === 'processing' && (
                    <div className="mt-3">
                        <Progress value={verificationProgress} className="h-2" />
                        <p className="text-xs text-slate-500 mt-2">
                            {verificationProgress < 25 && "Uploading documents..."}
                            {verificationProgress >= 25 && verificationProgress < 50 && "Validating document authenticity..."}
                            {verificationProgress >= 50 && verificationProgress < 75 && "Performing face match..."}
                            {verificationProgress >= 75 && "Finalizing verification..."}
                        </p>
                    </div>
                )}
            </div>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base md:text-lg">Document Verification</CardTitle>
                    <p className="text-xs md:text-sm text-slate-600">
                        Upload a government-issued ID for verification (Max 10MB)
                    </p>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="documentType">Document Type</Label>
                            <Select value={documentType} onValueChange={setDocumentType}>
                                <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                                    <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="id">National ID</SelectItem>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="license">Driver's License</SelectItem>
                                    <SelectItem value="residence">Residence Permit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Country of Issue</Label>
                            <Select>
                                <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                    <SelectItem value="ke">Kenya</SelectItem>
                                    <SelectItem value="ng">Nigeria</SelectItem>
                                    <SelectItem value="za">South Africa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Upload Document</Label>
                        <div
                            className="border-2 border-dashed border-slate-300 rounded-lg p-4 md:p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                            onClick={() => documentInputRef.current?.click()}
                        >
                            {documentPreview ? (
                                <div className="space-y-2">
                                    <img
                                        src={documentPreview}
                                        alt="Document"
                                        className="max-h-40 mx-auto rounded border border-slate-200"
                                    />
                                    <p className="text-sm text-slate-600 mt-2">Document uploaded</p>
                                    <p className="text-xs text-slate-500">
                                        {documentFile?.name} ({Math.round((documentFile?.size || 0) / 1024)}KB)
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                                    <p className="text-slate-600">Click to upload document</p>
                                    <p className="text-xs text-slate-500">JPG, PNG, PDF up to 10MB</p>
                                </div>
                            )}
                        </div>
                        <input
                            ref={documentInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleDocumentUpload}
                            className="hidden"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs md:text-sm text-blue-700">
                                For best results:
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Use a high-quality image with all corners visible</li>
                                    <li>Ensure text is clear and readable</li>
                                    <li>Avoid glare on laminated documents</li>
                                    <li>Expired documents will not be accepted</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm mt-4 md:mt-6">
                <CardHeader>
                    <CardTitle className="text-base md:text-lg">Biometric Verification</CardTitle>
                    <p className="text-xs md:text-sm text-slate-600">
                        Take a live selfie for face matching
                    </p>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label>Document Photo</Label>
                            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-center h-40 bg-slate-50">
                                {documentPreview ? (
                                    <img
                                        src={documentPreview}
                                        alt="Document"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <User className="w-10 h-10 mx-auto" />
                                        <p className="text-xs mt-2">Document photo will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Live Selfie</Label>
                            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-center h-40 bg-slate-50">
                                {selfiePreview ? (
                                    <img
                                        src={selfiePreview}
                                        alt="Selfie"
                                        className="max-h-full max-w-full object-cover rounded"
                                    />
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <User className="w-10 h-10 mx-auto" />
                                        <p className="text-xs mt-2">Selfie will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {selfiePreview ? (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={startCamera}
                                variant="outline"
                                className="border-slate-200 hover:bg-slate-50"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Retake Selfie
                            </Button>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 flex-1">
                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <p className="text-xs md:text-sm text-emerald-700">
                                    Face detected. Ensure your face matches the document photo.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <Button
                            onClick={startCamera}
                            variant="outline"
                            className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                            <Camera className="w-4 h-4 mr-2" />
                            Take Live Selfie
                        </Button>
                    )}

                    <div className="pt-4 border-t border-slate-100">
                        <Button
                            onClick={submitIdentityVerification}
                            disabled={!documentType || !documentFile || !selfieFile || isProcessing}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Verifying Identity...
                                </>
                            ) : (
                                'Submit for Verification'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Camera Modal */}
            <Dialog open={showCamera} onOpenChange={setShowCamera}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Identity Verification Selfie</DialogTitle>
                        <DialogDescription>
                            Position your face in the center and ensure good lighting
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full rounded-lg bg-black aspect-square"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="border-2 border-dashed border-white rounded-full w-48 h-48" />
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs md:text-sm text-blue-700 flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                Remove glasses and face the camera directly. Ensure your entire face is visible.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={closeCamera}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={takeSelfie}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Capture
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Rejection Reason Dialog */}
            <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Verification Rejected</DialogTitle>
                        <DialogDescription>
                            We couldn't verify your identity
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-red-700">Reason for rejection:</p>
                                    <p className="text-sm text-red-600 mt-1">{rejectionReason}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="font-medium text-slate-900">How to resolve:</p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li>Ensure all document details are clearly visible</li>
                                <li>Use a high-quality image without glare</li>
                                <li>Make sure your selfie matches the document photo</li>
                                <li>Submit an unexpired government-issued ID</li>
                                <li>Ensure both images are in focus</li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => {
                                setShowRejectionDialog(false);
                                setIdentityStatus('unverified');
                                setSelfiePreview(null);
                                setDocumentPreview(null);
                                setDocumentFile(null);
                                setSelfieFile(null);
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                            Try Again
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}