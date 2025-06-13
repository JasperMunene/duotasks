'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Smartphone,
    DollarSign,
    CheckCircle,
    Copy,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import LandingHeader from "@/components/landing/landing-header";

interface WithdrawStep {
    step: 1 | 2 | 3;
}

export default function WithdrawPage() {
    const [currentStep, setCurrentStep] = useState<WithdrawStep['step']>(1);
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [withdrawalInitiated, setWithdrawalInitiated] = useState(false);
    const [withdrawalId, setWithdrawalId] = useState('');
    const [transactionCost, setTransactionCost] = useState(0);
    const [totalDeduction, setTotalDeduction] = useState(0);

    // Simulate saved M-PESA number
    const [savedMpesaNumber] = useState('+254 712 345 678');

    const { toast } = useToast();

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as WithdrawStep['step']);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as WithdrawStep['step']);
        }
    };

    const calculateFees = (amount: number) => {
        // M-PESA withdrawal fees structure simulation
        if (amount <= 100) return 0;
        if (amount <= 500) return 7;
        if (amount <= 1000) return 12;
        if (amount <= 1500) return 22;
        if (amount <= 2500) return 32;
        if (amount <= 3500) return 51;
        if (amount <= 5000) return 60;
        if (amount <= 7500) return 75;
        if (amount <= 10000) return 87;
        if (amount <= 15000) return 100;
        return 110; // Max fee for amounts above 15,000
    };

    const handleInitiateWithdrawal = async () => {
        setIsProcessing(true);
        // Calculate transaction costs
        const amountNum = parseFloat(amount);
        const fee = calculateFees(amountNum);
        const total = amountNum + fee;

        setTransactionCost(fee);
        setTotalDeduction(total);

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setWithdrawalInitiated(true);
            setWithdrawalId(`WD${Date.now().toString().slice(-6)}`);
            setCurrentStep(3);
            toast({
                title: "Withdrawal Initiated",
                description: "Your funds are being processed",
            });
        }, 2000);
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${type} copied to clipboard`,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <LandingHeader />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/wallet">
                        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Withdraw Funds</h1>
                        <p className="text-slate-600 mt-1">Transfer money to your M-PESA account</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    step <= currentStep
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div className={`w-24 h-1 mx-2 ${
                                        step < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-slate-600">
                        <span>M-PESA Number</span>
                        <span>Amount</span>
                        <span>Confirm</span>
                    </div>
                </div>

                <Card className="border border-slate-200 shadow-sm">
                    <CardContent className="pt-6">
                        {/* Step 1: M-PESA Number Selection */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Smartphone className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Withdraw to M-PESA</h2>
                                    <p className="text-slate-600 mt-1">Funds will be sent to your registered number</p>
                                </div>

                                {/* Current M-PESA Number */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <div>
                                                <p className="font-medium text-emerald-900">Registered M-PESA Number</p>
                                                <p className="text-sm text-emerald-700">{savedMpesaNumber}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                            Verified
                                        </Badge>
                                    </div>
                                </div>

                                {/* Note about changing number */}
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                    <p className="text-sm text-slate-600">
                                        To update your M-PESA number, visit the
                                        <Link href="/wallet/payment-methods" className="text-emerald-600 font-medium mx-1">
                                            Payment Methods
                                        </Link>
                                        section in your wallet settings.
                                    </p>
                                </div>

                                {/* Continue Button */}
                                <Button
                                    onClick={handleNext}
                                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    Continue
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Amount Entry */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DollarSign className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Enter Amount</h2>
                                    <p className="text-slate-600 mt-1">How much do you want to withdraw?</p>
                                </div>

                                {/* Selected M-PESA Number */}
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-emerald-600" />
                                        <div>
                                            <p className="font-medium text-slate-900">Withdrawing to M-PESA</p>
                                            <p className="text-sm text-slate-600">{savedMpesaNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="withdraw-amount">Amount (KES)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="withdraw-amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="pl-10 h-12 text-lg"
                                            min="10"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">Minimum withdrawal: KES 10</p>
                                </div>

                                {/* Transaction Costs Preview */}
                                {amount && parseFloat(amount) > 0 && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Withdrawal Amount</span>
                                                <span className="font-medium">KES {parseFloat(amount).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Transaction Fee</span>
                                                <span className="font-medium">KES {calculateFees(parseFloat(amount)).toLocaleString()}</span>
                                            </div>
                                            <Separator className="my-1" />
                                            <div className="flex justify-between">
                                                <span className="text-slate-900 font-medium">Total Deduction</span>
                                                <span className="text-emerald-600 font-bold">KES {(parseFloat(amount) + calculateFees(parseFloat(amount))).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleBack}
                                        variant="outline"
                                        className="flex-1 h-12"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleInitiateWithdrawal}
                                        disabled={!amount || parseFloat(amount) < 10}
                                        className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Withdraw Funds
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Withdrawal Confirmation */}
                        {currentStep === 3 && withdrawalInitiated && (
                            <div className="space-y-6 text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Withdrawal Initiated!</h2>
                                    <p className="text-slate-600">Your funds are being processed</p>
                                </div>

                                {/* Withdrawal Details */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-4">
                                    <div className="text-3xl font-bold text-emerald-600">
                                        KES {parseFloat(amount).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-emerald-700">
                                        To: {savedMpesaNumber}
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-emerald-100">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Transaction Fee</span>
                                            <span className="font-medium">KES {transactionCost.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Processing Time</span>
                                            <span className="font-medium">1-5 minutes</span>
                                        </div>
                                    </div>

                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                        Withdrawal ID: {withdrawalId}
                                    </Badge>
                                </div>

                                {/* Status Timeline */}
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left">
                                    <h3 className="font-medium text-slate-900 mb-3">Transaction Status</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">Request Received</p>
                                                <p className="text-xs text-slate-500">Just now</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">Processing</p>
                                                <p className="text-xs text-slate-500">Usually completes in 1-2 minutes</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">Funds Sent</p>
                                                <p className="text-xs text-slate-500">You'll receive an M-PESA confirmation</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => copyToClipboard(withdrawalId, 'Withdrawal ID')}
                                        variant="outline"
                                        className="w-full h-12"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Transaction ID
                                    </Button>

                                    <div className="pt-4 border-t border-slate-200">
                                        <Link href="/wallet" className="block">
                                            <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700">
                                                <Download className="w-4 h-4 mr-2" />
                                                Make Another Withdrawal
                                            </Button>
                                        </Link>

                                        <Link href="/wallet/history" className="block mt-3">
                                            <Button variant="outline" className="w-full h-12">
                                                View Transaction History
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Processing Dialog */}
                <Dialog open={isProcessing} onOpenChange={() => {}}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-center">Processing Withdrawal</DialogTitle>
                            <DialogDescription className="text-center">
                                Please wait while we process your withdrawal request...
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center py-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        </div>
                        <p className="text-center text-sm text-slate-500">
                            Do not close this window while transaction is processing
                        </p>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}