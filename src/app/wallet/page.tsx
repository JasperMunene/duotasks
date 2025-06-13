'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Wallet,
    Download,
    Eye,
    EyeOff,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Smartphone,
    CheckCircle,
    AlertCircle,
    Clock,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Transaction {
    id: string;
    type: 'sent' | 'received' | 'added';
    amount: number;
    description: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
    method: 'mpesa' | 'card' | 'wallet';
    reference: string;
    recipient?: string;
    sender?: string;
}

const mockTransactions: Transaction[] = [
    {
        id: 'txn_001',
        type: 'received',
        amount: 1200,
        description: 'Payment for House Cleaning task',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'completed',
        method: 'mpesa',
        reference: 'MPE123456789',
        sender: 'John Doe'
    },
    {
        id: 'txn_002',
        type: 'added',
        amount: 2000,
        description: 'Added money to wallet',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'completed',
        method: 'mpesa',
        reference: 'ADD987654321'
    },
    {
        id: 'txn_003',
        type: 'sent',
        amount: 500,
        description: 'Payment to Sarah Wilson',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        status: 'completed',
        method: 'mpesa',
        reference: 'MPE987654321',
        recipient: 'Sarah Wilson'
    },
    {
        id: 'txn_004',
        type: 'received',
        amount: 800,
        description: 'Refund for cancelled task',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'pending',
        method: 'wallet',
        reference: 'REF789123456',
        sender: 'Duotasks Support'
    },
    {
        id: 'txn_005',
        type: 'added',
        amount: 1500,
        description: 'Added money via card',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        status: 'completed',
        method: 'card',
        reference: 'CRD456789123'
    }
];

export default function WalletPage() {
    const [showBalance, setShowBalance] = useState(true);
    const [walletBalance] = useState(4750.50);
    const [mpesaLinked] = useState(true);
    const [mpesaNumber] = useState('+254 712 345 678');

    const recentTransactions = mockTransactions.slice(0, 5);

    const getStatusIcon = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
        }
    };

    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'failed':
                return 'bg-red-50 text-red-700 border-red-200';
        }
    };

    const getMethodIcon = (method: Transaction['method']) => {
        switch (method) {
            case 'mpesa':
                return <Smartphone className="w-4 h-4 text-emerald-600" />;
            case 'card':
                return <CreditCard className="w-4 h-4 text-blue-600" />;
            case 'wallet':
                return <Wallet className="w-4 h-4 text-purple-600" />;
        }
    };

    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'received':
                return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
            case 'sent':
                return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
            case 'added':
                return <Plus className="w-4 h-4 text-purple-600" />;
        }
    };

    const getTransactionColor = (type: Transaction['type']) => {
        switch (type) {
            case 'received':
                return 'bg-emerald-50';
            case 'sent':
                return 'bg-blue-50';
            case 'added':
                return 'bg-purple-50';
        }
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Wallet className="h-8 w-8 text-emerald-600" />
                        <h1 className="text-3xl font-bold text-slate-900">My Wallet</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/wallet/history">
                            <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View All Transactions
                            </Button>
                        </Link>
                        <Link href="/wallet/payment-methods">
                            <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Payment Methods
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Balance & Quick Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Balance Card */}
                        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-medium text-emerald-100">
                                        Available Balance
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowBalance(!showBalance)}
                                        className="text-emerald-100 hover:bg-emerald-400/20"
                                    >
                                        {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-4xl font-bold">
                                        {showBalance ? `KES ${walletBalance.toLocaleString()}` : 'KES ******'}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href="/wallet/add-money" className="flex-1">
                                            <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-medium">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Money
                                            </Button>
                                        </Link>
                                        <Link href="/wallet/withdraw" className="flex-1">
                                            <Button className="w-full bg-emerald-400 text-white hover:bg-emerald-300 font-medium">
                                                <Download className="w-4 h-4 mr-2" />
                                                Withdraw
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* M-PESA Status Card */}
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <Smartphone className="w-5 h-5 text-emerald-600" />
                                    M-PESA Account
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        {mpesaLinked ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                    <span className="font-medium text-slate-900">Connected</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{mpesaNumber}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                                    <span className="font-medium text-slate-900">Not Connected</span>
                                                </div>
                                                <p className="text-sm text-slate-600">Link your M-PESA account for faster payments</p>
                                            </>
                                        )}
                                    </div>
                                    <Link href="/wallet/payment-methods">
                                        <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                                            {mpesaLinked ? 'Manage' : 'Link Account'}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Transactions */}
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold text-slate-900">
                                        Recent Transactions
                                    </CardTitle>
                                    <Link href="/wallet/history">
                                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentTransactions.map((transaction, index) => (
                                    <div key={transaction.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${getTransactionColor(transaction.type)}`}>
                                                    {getTransactionIcon(transaction.type)}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium text-slate-900 text-sm">
                                                        {transaction.description}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        {getMethodIcon(transaction.method)}
                                                        <span className="text-xs text-slate-500">
                              {transaction.reference}
                            </span>
                                                        <Badge variant="outline" className={`text-xs ${getStatusColor(transaction.status)}`}>
                                                            {transaction.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${
                                                    transaction.type === 'sent'
                                                        ? 'text-slate-900'
                                                        : 'text-emerald-600'
                                                }`}>
                                                    {transaction.type === 'sent' ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-500">{formatTime(transaction.timestamp)}</p>
                                            </div>
                                        </div>
                                        {index < recentTransactions.length - 1 && <Separator className="mt-4" />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Quick Stats & Actions */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-slate-900">
                                    This Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Money Added</span>
                                        <span className="font-semibold text-emerald-600">+KES 3,500</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Money Received</span>
                                        <span className="font-semibold text-emerald-600">+KES 4,500</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Money Sent</span>
                                        <span className="font-semibold text-slate-900">-KES 800</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-900">Net Income</span>
                                        <span className="font-bold text-emerald-600">+KES 7,200</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-slate-900">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/wallet/add-money" className="block">
                                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                                        <Plus className="w-4 h-4 mr-3" />
                                        Add Money
                                    </Button>
                                </Link>
                                <Link href="/wallet/withdraw" className="block">
                                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                                        <Download className="w-4 h-4 mr-3" />
                                        Withdraw
                                    </Button>
                                </Link>
                                <Link href="/wallet/payment-methods" className="block">
                                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                                        <CreditCard className="w-4 h-4 mr-3" />
                                        Payment Methods
                                    </Button>
                                </Link>
                                <Link href="/wallet/history" className="block">
                                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                                        <ExternalLink className="w-4 h-4 mr-3" />
                                        Transaction History
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Security Notice */}
                        <Card className="border border-blue-200 bg-blue-50 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-blue-900">Secure & Protected</h4>
                                        <p className="text-sm text-blue-700">
                                            Your wallet is protected with bank-level security and encryption.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}