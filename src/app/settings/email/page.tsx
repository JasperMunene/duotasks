'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function EmailSettings() {
    const [email, setEmail] = useState('jasper.munene@example.com');
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailCode, setEmailCode] = useState('');
    const [emailCodeSent, setEmailCodeSent] = useState(false);
    const [emailVerifying, setEmailVerifying] = useState(false);
    const { toast } = useToast();

    const sendEmailCode = async () => {
        setEmailVerifying(true);
        setTimeout(() => {
            setEmailCodeSent(true);
            setEmailVerifying(false);
            toast({
                title: "Verification Code Sent",
                description: "Check your email for the verification code",
            });
        }, 2000);
    };

    const verifyEmail = async () => {
        setEmailVerifying(true);
        setTimeout(() => {
            setEmailVerified(true);
            setEmailCodeSent(false);
            setEmailCode('');
            setEmailVerifying(false);
            toast({
                title: "Email Verified",
                description: "Your email address has been successfully verified",
            });
        }, 1500);
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Mail className="w-6 h-6 text-emerald-600" />
                    Email
                </h1>
                <p className="text-slate-600 mt-1">
                    Verify your email address to receive important notifications and updates.
                </p>
            </div>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Email address</CardTitle>
                    <p className="text-sm text-slate-600">We will send you a verification code</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Current Status */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${emailVerified ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                            <div>
                                <p className="font-medium text-slate-900">
                                    {emailVerified ? 'Email Verified' : 'Email Not Verified'}
                                </p>
                                <p className="text-sm text-slate-600">{email}</p>
                            </div>
                        </div>
                        <Badge variant={emailVerified ? 'default' : 'secondary'}
                               className={emailVerified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}>
                            {emailVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="your.email@example.com"
                            />
                        </div>
                    </div>

                    {/* Verification Code Section */}
                    {emailCodeSent && (
                        <div className="space-y-2">
                            <Label htmlFor="email-code">Verification Code</Label>
                            <Input
                                id="email-code"
                                value={emailCode}
                                onChange={(e) => setEmailCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {!emailCodeSent ? (
                            <Button
                                onClick={sendEmailCode}
                                disabled={emailVerifying || !email}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                            >
                                {emailVerifying ? 'Sending...' : 'Send'}
                            </Button>
                        ) : (
                            <Button
                                onClick={verifyEmail}
                                disabled={emailVerifying || emailCode.length !== 6}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                            >
                                {emailVerifying ? 'Verifying...' : 'Verify Email'}
                            </Button>
                        )}
                    </div>

                    {emailVerified && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <p className="text-emerald-700 font-medium">Email address verified successfully!</p>
                            </div>
                        </div>
                    )}

                    {/* Info Text */}
                    <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                        <p>
                            Your email address is used for account notifications, security alerts, and important updates about your tasks.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}