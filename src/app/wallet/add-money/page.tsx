'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Smartphone,
    CreditCard,
    ExternalLink,
    DollarSign,
    Shield,
    CheckCircle,
    AlertCircle,
    Phone,
    Copy,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { QRCodeCanvas } from 'qrcode.react';
import LandingHeader from "@/components/landing/landing-header";

interface PaymentStep {
    step: 1 | 2 | 3 | 4;
}

export default function AddMoneyPage() {
    const [currentStep, setCurrentStep] = useState<PaymentStep['step']>(1);
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'link' | null>(null);
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionComplete, setTransactionComplete] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [paymentLink, setPaymentLink] = useState('');
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
    const paymentLinkRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    // Simulate saved M-PESA number for returning users
    const [savedMpesaNumber] = useState('+254 712 345 678');

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep((prev) => (prev + 1) as PaymentStep['step']);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as PaymentStep['step']);
        } else {
            setPaymentMethod(null);
        }
    };

    const handlePaymentMethodSelect = (method: 'mpesa' | 'card' | 'link') => {
        setPaymentMethod(method);
        if (method === 'mpesa') {
            // Check if user has saved M-PESA number
            if (savedMpesaNumber) {
                setMpesaPhone(savedMpesaNumber);
                setIsFirstTimeUser(false);
            } else {
                setIsFirstTimeUser(true);
            }
        }
        handleNext();
    };

    const handleMpesaSubmit = async () => {
        setIsProcessing(true);
        // Simulate API call to send STK push
        setTimeout(() => {
            setIsProcessing(false);
            setTransactionComplete(true);
            setTransactionId(`ADD${Date.now()}`);
            setCurrentStep(4);
            toast({
                title: "Money Added Successfully!",
                description: `KES ${amount} has been added to your wallet`,
            });
        }, 3000);
    };

    const handleCardPayment = () => {
        // Redirect to card payment gateway
        toast({
            title: "Redirecting to Payment Gateway",
            description: "You will be redirected to complete your card payment",
        });
    };

    const handlePaymentLink = () => {
        // Generate payment link
        const link = `https://duotasks.com/pay/add-money?amount=${amount}&user=current`;
        setPaymentLink(link);
        navigator.clipboard.writeText(link);
        toast({
            title: "Payment Link Generated",
            description: "Payment link copied to clipboard",
        });
    };

    const copyToClipboard = () => {
        if (paymentLinkRef.current) {
            paymentLinkRef.current.select();
            document.execCommand('copy');
            toast({
                title: "Copied to Clipboard",
                description: "Payment link copied to clipboard",
            });
        }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setPaymentMethod(null);
        setMpesaPhone('');
        setAmount('');
        setTransactionComplete(false);
        setTransactionId('');
        setPaymentLink('');
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
                        <h1 className="text-3xl font-bold text-slate-900">Add Money to Wallet</h1>
                        <p className="text-slate-600 mt-1">Choose your preferred payment method</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    step <= currentStep
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div className={`w-16 h-1 mx-2 ${
                                        step < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-slate-600">
                        <span>Method</span>
                        <span>Details</span>
                        <span>Confirm</span>
                        <span>Complete</span>
                    </div>
                </div>

                <Card className="border border-slate-200 shadow-sm">
                    <CardContent className="pt-6">
                        {/* Step 1: Payment Method Selection */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DollarSign className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Select Payment Method</h2>
                                    <p className="text-slate-600 mt-1">Choose how you want to add money to your wallet</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <Button
                                        onClick={() => handlePaymentMethodSelect('mpesa')}
                                        variant="outline"
                                        className="h-20 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                                <Smartphone className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-semibold text-slate-900">M-PESA</h3>
                                                <p className="text-sm text-slate-600">Pay using your M-PESA account</p>
                                            </div>
                                        </div>
                                    </Button>

                                    <Button
                                        onClick={() => handlePaymentMethodSelect('card')}
                                        variant="outline"
                                        className="h-20 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-semibold text-slate-900">Credit/Debit Card</h3>
                                                <p className="text-sm text-slate-600">Pay using Visa or Mastercard</p>
                                            </div>
                                        </div>
                                    </Button>

                                    <Button
                                        onClick={() => handlePaymentMethodSelect('link')}
                                        variant="outline"
                                        className="h-20 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                                <ExternalLink className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-semibold text-slate-900">Payment Link</h3>
                                                <p className="text-sm text-slate-600">Generate a secure payment link</p>
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment Details */}
                        {currentStep === 2 && paymentMethod === 'mpesa' && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Smartphone className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">M-PESA Payment Details</h2>
                                    <p className="text-slate-600 mt-1">
                                        {isFirstTimeUser ? 'Enter your M-PESA details' : 'Enter the amount to add'}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {isFirstTimeUser ? (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="mpesa-phone">M-PESA Phone Number</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        id="mpesa-phone"
                                                        placeholder="+254 712 345 678"
                                                        value={mpesaPhone}
                                                        onChange={(e) => setMpesaPhone(e.target.value)}
                                                        className="pl-10 h-12"
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                                    <div className="text-sm text-yellow-700">
                                                        <p className="font-medium">Verification Charge</p>
                                                        <p>A KES 1 verification charge will be applied and immediately refunded to confirm your number.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                <div>
                                                    <p className="font-medium text-emerald-900">Using saved M-PESA number</p>
                                                    <p className="text-sm text-emerald-700">{savedMpesaNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (KES)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="pl-10 h-12 text-lg"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleBack}
                                        variant="outline"
                                        className="flex-1 h-12"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        disabled={!amount || (!isFirstTimeUser ? false : !mpesaPhone)}
                                        className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Card Payment */}
                        {currentStep === 2 && paymentMethod === 'card' && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CreditCard className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Card Payment</h2>
                                    <p className="text-slate-600 mt-1">Enter the amount to add to your wallet</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="card-amount">Amount (KES)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="card-amount"
                                                type="number"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="pl-10 h-12 text-lg"
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <div className="text-sm text-emerald-700">
                                            <p className="font-medium">Secure Payment</p>
                                            <p>You'll be redirected to our secure payment gateway to complete your transaction.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleBack}
                                        variant="outline"
                                        className="flex-1 h-12"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleCardPayment}
                                        disabled={!amount}
                                        className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Proceed to Payment
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment Link */}
                        {currentStep === 2 && paymentMethod === 'link' && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ExternalLink className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Payment Link</h2>
                                    <p className="text-slate-600 mt-1">Generate a secure payment link</p>
                                </div>

                                {!paymentLink ? (
                                    <>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="link-amount">Amount (KES)</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        id="link-amount"
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        className="pl-10 h-12 text-lg"
                                                        min="1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                                <div className="text-sm text-emerald-700">
                                                    <p className="font-medium">Payment Link</p>
                                                    <p>A secure payment link will be generated that you can use to complete the payment.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleBack}
                                                variant="outline"
                                                className="flex-1 h-12"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                onClick={handlePaymentLink}
                                                disabled={!amount}
                                                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                Generate Link
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="text-sm text-emerald-700">
                                                <p className="font-medium">Payment Link Generated</p>
                                                <p>Share this link to receive payment. The funds will be added to your wallet.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Payment Link</Label>
                                            <div className="flex">
                                                <input
                                                    ref={paymentLinkRef}
                                                    type="text"
                                                    value={paymentLink}
                                                    readOnly
                                                    className="flex-1 border border-r-0 rounded-l-lg px-4 py-3 focus:outline-none"
                                                />
                                                <Button
                                                    onClick={copyToClipboard}
                                                    className="rounded-l-none rounded-r-lg bg-emerald-600 hover:bg-emerald-700"
                                                >
                                                    <Copy className="w-4 h-4 mr-2" /> Copy
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center space-y-4 py-4">
                                            <div className="p-4 bg-white rounded-lg border border-slate-200">
                                                <QRCodeCanvas
                                                    value={paymentLink}
                                                    size={180}
                                                    fgColor="#059669"
                                                    level="H"
                                                />
                                            </div>
                                            <p className="text-sm text-slate-600">Scan QR code to make payment</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setPaymentLink('')}
                                                variant="outline"
                                                className="flex-1 h-12"
                                            >
                                                Generate New Link
                                            </Button>
                                            <Button
                                                onClick={handleBack}
                                                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                Done
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Confirmation (M-PESA only) */}
                        {currentStep === 3 && paymentMethod === 'mpesa' && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Confirm Payment</h2>
                                    <p className="text-slate-600 mt-1">Review details and confirm payment</p>
                                </div>

                                {/* Transaction Summary */}
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                                    <h3 className="font-medium text-slate-900">Payment Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Amount</span>
                                            <span className="font-medium">KES {parseFloat(amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">M-PESA Number</span>
                                            <span className="font-medium">{mpesaPhone}</span>
                                        </div>
                                        {isFirstTimeUser && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Verification Fee</span>
                                                <span className="font-medium">KES 1 (Refunded)</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                                        <div className="text-sm text-emerald-700">
                                            <p className="font-medium">STK Push Verification</p>
                                            <p>We'll send an STK push to your phone to make the payment.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleBack}
                                        variant="outline"
                                        className="flex-1 h-12"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleMpesaSubmit}
                                        disabled={isProcessing}
                                        className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending STK Push...
                                            </>
                                        ) : 'Confirm Payment'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Success */}
                        {currentStep === 4 && transactionComplete && (
                            <div className="space-y-6 text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Money Added Successfully!</h2>
                                    <p className="text-slate-600">Your wallet has been updated</p>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-3">
                                    <div className="text-3xl font-bold text-emerald-600">
                                        +KES {parseFloat(amount).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-emerald-700">
                                        Added via {paymentMethod?.toUpperCase()}
                                    </div>
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                        Transaction ID: {transactionId}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <Link href="/wallet" className="block">
                                        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700">
                                            Back to Wallet
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        className="w-full h-12"
                                    >
                                        Add More Money
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Processing Dialog */}
                <Dialog open={isProcessing} onOpenChange={() => {}}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-center">Processing Payment</DialogTitle>
                            <DialogDescription className="text-center">
                                Sending STK push to your phone...
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center py-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                            <p className="text-sm text-slate-600 text-center">
                                Please check your phone and approve the payment request
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}