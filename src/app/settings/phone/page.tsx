// SETTINGS/PHONE/PAGE.TSX
'use client';

import { useState } from 'react';
import { Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'

export default function PhoneSettings() {
    const [phoneNumber, setPhoneNumber] = useState('+254 712 345 678');
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [phoneCode, setPhoneCode] = useState('');
    const [phoneCodeSent, setPhoneCodeSent] = useState(false);
    const [phoneVerifying, setPhoneVerifying] = useState(false);
    const { toast } = useToast();

    const sendPhoneCode = async () => {
        setPhoneVerifying(true);
        setTimeout(() => {
            setPhoneCodeSent(true);
            setPhoneVerifying(false);
            toast({
                title: "Verification Code Sent",
                description: "We'll keep you up to date about the latest happenings on your tasks by SMS.",
            });
        }, 2000);
    };

    const verifyPhone = async () => {
        setPhoneVerifying(true);
        setTimeout(() => {
            setPhoneVerified(true);
            setPhoneCodeSent(false);
            setPhoneCode('');
            setPhoneVerifying(false);
            toast({
                title: "Phone Verified",
                description: "Your phone number has been successfully verified",
            });
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    Mobile
                </h1>
                <p className="text-slate-600 mt-1 text-sm md:text-base">
                    We'll keep you up to date about the latest happenings on your tasks by SMS.
                </p>
            </div>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base md:text-lg">Mobile number</CardTitle>
                    <p className="text-xs md:text-sm text-slate-600">We will send you a verification code</p>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                    {/* Current Status */}
                    <div className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${phoneVerified ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                            <div>
                                <p className="font-medium text-slate-900 text-sm md:text-base">
                                    {phoneVerified ? 'Phone Verified' : 'Phone Not Verified'}
                                </p>
                                <p className="text-xs md:text-sm text-slate-600">{phoneNumber}</p>
                            </div>
                        </div>
                        <Badge variant={phoneVerified ? 'default' : 'secondary'}
                               className={cn(
                                   phoneVerified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : '',
                                   'text-xs md:text-sm'
                               )}>
                            {phoneVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                    </div>

                    {/* Phone Number Input */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm md:text-base">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="phone"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm md:text-base"
                                placeholder="0412345678"
                            />
                        </div>
                    </div>

                    {/* Verification Code Section */}
                    {phoneCodeSent && (
                        <div className="space-y-2">
                            <Label htmlFor="phone-code" className="text-sm md:text-base">Verification Code</Label>
                            <Input
                                id="phone-code"
                                value={phoneCode}
                                onChange={(e) => setPhoneCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm md:text-base"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {!phoneCodeSent ? (
                            <Button
                                onClick={sendPhoneCode}
                                disabled={phoneVerifying || !phoneNumber}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-8 py-2 text-sm md:text-base"
                            >
                                {phoneVerifying ? 'Sending...' : 'Send Code'}
                            </Button>
                        ) : (
                            <Button
                                onClick={verifyPhone}
                                disabled={phoneVerifying || phoneCode.length !== 6}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-8 py-2 text-sm md:text-base"
                            >
                                {phoneVerifying ? 'Verifying...' : 'Verify Phone'}
                            </Button>
                        )}
                    </div>

                    {phoneVerified && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 md:p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                                <p className="text-emerald-700 font-medium text-sm md:text-base">Phone number verified successfully!</p>
                            </div>
                        </div>
                    )}

                    {/* Info Text */}
                    <div className="text-xs md:text-sm text-slate-600 bg-slate-50 p-3 md:p-4 rounded-lg">
                        <p>
                            Verifying your mobile number helps us know you're a genuine human! We won't show it to anyone or sell it on to any 3rd party. It's just for us to send you some good stuff.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}