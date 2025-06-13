'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Smartphone,
    Plus,
    CheckCircle,
    AlertCircle,
    Edit2,
    Trash2,
    Shield,
    Phone,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface PaymentMethod {
    id: string;
    type: 'mpesa';
    name: string;
    details: string;
    isDefault: boolean;
    isVerified: boolean;
    lastUsed?: Date;
}

const mockPaymentMethods: PaymentMethod[] = [
    {
        id: 'mpesa_1',
        type: 'mpesa',
        name: 'M-PESA Account',
        details: '+254 712 345 678',
        isDefault: true,
        isVerified: true,
        lastUsed: new Date(Date.now() - 1000 * 60 * 30)
    }
];

export default function PaymentMethodsPage() {
    const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
    const [showAddMpesa, setShowAddMpesa] = useState(false);
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleMpesaLink = async () => {
        setIsVerifying(true);
        // Simulate API call to send STK push
        setTimeout(() => {
            setIsVerifying(false);
            setShowAddMpesa(false);
            // Add new M-PESA account to list
            const newMpesa: PaymentMethod = {
                id: `mpesa_${Date.now()}`,
                type: 'mpesa',
                name: 'M-PESA Account',
                details: mpesaPhone,
                isDefault: paymentMethods.length === 0,
                isVerified: true,
            };
            setPaymentMethods([...paymentMethods, newMpesa]);
            setMpesaPhone('');
        }, 3000);
    };

    const removePaymentMethod = (id: string) => {
        setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    };

    const setAsDefault = (id: string) => {
        setPaymentMethods(paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id
        })));
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/wallet">
                        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Payment Methods</h1>
                        <p className="text-slate-600 mt-1">Manage your payment methods and preferences</p>
                    </div>
                </div>

                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="bg-slate-100 p-1 rounded-lg">
                        <TabsTrigger value="all" className="rounded-md">All Methods</TabsTrigger>
                        <TabsTrigger value="mpesa" className="rounded-md">M-PESA</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-6">
                        {/* Add New Payment Method */}
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-slate-900">
                                    Add Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    <Dialog open={showAddMpesa} onOpenChange={setShowAddMpesa}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="h-24 border-2 border-dashed border-slate-300 hover:border-emerald-300 hover:bg-emerald-50">
                                                <div className="text-center">
                                                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                                                    <span className="font-medium">Add M-PESA</span>
                                                </div>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Link M-PESA Account</DialogTitle>
                                                <DialogDescription>
                                                    Connect your M-PESA account for instant payments and withdrawals.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="mpesa-phone">Phone Number</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="mpesa-phone"
                                                            placeholder="+254 712 345 678"
                                                            value={mpesaPhone}
                                                            onChange={(e) => setMpesaPhone(e.target.value)}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                                        <div className="text-sm text-blue-700">
                                                            <p className="font-medium">Verification Process</p>
                                                            <p>We'll send an STK push to your phone to verify your account. You'll be charged <span className="font-bold">1 KES</span> which will be immediately refunded.</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setShowAddMpesa(false)}
                                                        className="flex-1"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleMpesaLink}
                                                        disabled={!mpesaPhone || isVerifying}
                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                    >
                                                        {isVerifying ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Sending STK Push...
                                                            </>
                                                        ) : 'Verify Account'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods List */}
                        <div className="space-y-4">
                            {paymentMethods.map((method) => (
                                <Card key={method.id} className="border border-slate-200 shadow-sm">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-full bg-emerald-50`}>
                                                    <Smartphone className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-slate-900">{method.name}</h3>
                                                        {method.isVerified && (
                                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                        )}
                                                        {method.isDefault && (
                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600">{method.details}</p>
                                                    {method.lastUsed && (
                                                        <p className="text-xs text-slate-500">
                                                            Last used {formatTime(method.lastUsed)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!method.isDefault && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setAsDefault(method.id)}
                                                        className="border-slate-200 hover:bg-slate-50"
                                                    >
                                                        Set Default
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-slate-100"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removePaymentMethod(method.id)}
                                                    className="hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="mpesa" className="space-y-4">
                        {paymentMethods.map((method) => (
                            <Card key={method.id} className="border border-slate-200 shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-full bg-emerald-50">
                                                <Smartphone className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">{method.name}</h3>
                                                    {method.isVerified && (
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    )}
                                                    {method.isDefault && (
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                            Default
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600">{method.details}</p>
                                                {method.lastUsed && (
                                                    <p className="text-xs text-slate-500">
                                                        Last used {formatTime(method.lastUsed)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!method.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setAsDefault(method.id)}
                                                    className="border-slate-200 hover:bg-slate-50"
                                                >
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-slate-100"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removePaymentMethod(method.id)}
                                                className="hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>

                {/* Security Information */}
                <Card className="border border-emerald-200 bg-emerald-50 shadow-sm mt-8">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Shield className="w-6 h-6 text-emerald-600 mt-0.5" />
                            <div className="space-y-2">
                                <h4 className="font-semibold text-emerald-900">Your Payment Methods are Secure</h4>
                                <p className="text-sm text-emerald-700 leading-relaxed">
                                    All payment information is encrypted and stored securely.
                                    We never store your M-PESA PIN or card details on our servers.
                                    Your financial information is protected with bank-level security.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}