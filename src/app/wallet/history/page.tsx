'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Search,
    Filter,
    Download,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Smartphone,
    CreditCard,
    Wallet,
    CheckCircle,
    AlertCircle,
    Clock,
    ChevronDown,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import LandingHeader from "@/components/landing/landing-header";

interface Transaction {
    id: string;
    type: 'sent' | 'received';
    amount: number;
    description: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
    method: 'mpesa' | 'card' | 'wallet';
    reference: string;
    recipient?: string;
    sender?: string;
    taskId?: string;
    fee?: number;
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
        sender: 'John Doe',
        taskId: 'task_001',
        fee: 12
    },
    {
        id: 'txn_002',
        type: 'sent',
        amount: 500,
        description: 'Payment to Sarah Wilson',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'completed',
        method: 'mpesa',
        reference: 'MPE987654321',
        recipient: 'Sarah Wilson',
        taskId: 'task_002',
        fee: 5
    },
    {
        id: 'txn_003',
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
        id: 'txn_004',
        type: 'sent',
        amount: 300,
        description: 'Payment for Garden Maintenance',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        status: 'failed',
        method: 'mpesa',
        reference: 'MPE456789123',
        recipient: 'Mike Chen',
        taskId: 'task_003',
        fee: 3
    },
    {
        id: 'txn_005',
        type: 'received',
        amount: 2500,
        description: 'Payment for Website Development',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        status: 'completed',
        method: 'card',
        reference: 'CRD123789456',
        sender: 'Tech Solutions Ltd',
        taskId: 'task_004',
        fee: 25
    },
    {
        id: 'txn_006',
        type: 'sent',
        amount: 150,
        description: 'Payment for Plumbing Services',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
        status: 'completed',
        method: 'mpesa',
        reference: 'MPE789456123',
        recipient: 'David Kim',
        taskId: 'task_005',
        fee: 1.5
    },
    {
        id: 'txn_007',
        type: 'received',
        amount: 600,
        description: 'Payment for Furniture Assembly',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120),
        status: 'completed',
        method: 'mpesa',
        reference: 'MPE321654987',
        sender: 'Lisa Johnson',
        taskId: 'task_006',
        fee: 6
    },
    {
        id: 'txn_008',
        type: 'sent',
        amount: 400,
        description: 'Payment for Electrical Work',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144),
        status: 'completed',
        method: 'wallet',
        reference: 'WAL654321789',
        recipient: 'Robert Brown',
        taskId: 'task_007'
    }
];

export default function PaymentHistoryPage() {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'sent' | 'received'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
    const [methodFilter, setMethodFilter] = useState<'all' | 'mpesa' | 'card' | 'wallet'>('all');
    const [dateFrom, setDateFrom] = useState<Date>();
    const [dateTo, setDateTo] = useState<Date>();
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    // Filter transactions based on current filters
    const filteredTransactions = transactions.filter(transaction => {
        // Search filter
        if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !(transaction.sender?.toLowerCase().includes(searchQuery.toLowerCase())) &&
            !(transaction.recipient?.toLowerCase().includes(searchQuery.toLowerCase()))) {
            return false;
        }

        // Type filter
        if (typeFilter !== 'all' && transaction.type !== typeFilter) {
            return false;
        }

        // Status filter
        if (statusFilter !== 'all' && transaction.status !== statusFilter) {
            return false;
        }

        // Method filter
        if (methodFilter !== 'all' && transaction.method !== methodFilter) {
            return false;
        }

        // Date range filter
        if (dateFrom && transaction.timestamp < dateFrom) {
            return false;
        }
        if (dateTo && transaction.timestamp > dateTo) {
            return false;
        }

        return true;
    });

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

    const formatDateTime = (date: Date) => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const exportTransactions = () => {
        // In a real app, this would generate and download a CSV/PDF
        console.log('Exporting transactions:', filteredTransactions);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setTypeFilter('all');
        setStatusFilter('all');
        setMethodFilter('all');
        setDateFrom(undefined);
        setDateTo(undefined);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <LandingHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/wallet">
                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
                            <p className="text-slate-600 mt-1">
                                {filteredTransactions.length} of {transactions.length} transactions
                            </p>
                        </div>
                    </div>
                    <Button onClick={exportTransactions} variant="outline" className="border-slate-200 hover:bg-slate-50">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold text-slate-900">Filters</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 hover:text-slate-700">
                                        Clear
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Search */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Search transactions..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 border-slate-200"
                                        />
                                    </div>
                                </div>

                                {/* Transaction Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Type</label>
                                    <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                                        <SelectTrigger className="border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="received">Received</SelectItem>
                                            <SelectItem value="sent">Sent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Status</label>
                                    <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                        <SelectTrigger className="border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Method</label>
                                    <Select value={methodFilter} onValueChange={(value: any) => setMethodFilter(value)}>
                                        <SelectTrigger className="border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Methods</SelectItem>
                                            <SelectItem value="mpesa">M-PESA</SelectItem>
                                            <SelectItem value="card">Card</SelectItem>
                                            <SelectItem value="wallet">Wallet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Range */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Date Range</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal border-slate-200",
                                                        !dateFrom && "text-slate-500"
                                                    )}
                                                >
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {dateFrom ? format(dateFrom, 'MMM dd') : 'From'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={dateFrom}
                                                    onSelect={setDateFrom}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal border-slate-200",
                                                        !dateTo && "text-slate-500"
                                                    )}
                                                >
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {dateTo ? format(dateTo, 'MMM dd') : 'To'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={dateTo}
                                                    onSelect={setDateTo}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary Stats */}
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-slate-900">Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Total Received</span>
                                    <span className="font-semibold text-emerald-600">
                    +KES {filteredTransactions
                                        .filter(t => t.type === 'received' && t.status === 'completed')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                        .toLocaleString()}
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Total Sent</span>
                                    <span className="font-semibold text-slate-900">
                    -KES {filteredTransactions
                                        .filter(t => t.type === 'sent' && t.status === 'completed')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                        .toLocaleString()}
                  </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-900">Net Amount</span>
                                    <span className="font-bold text-emerald-600">
                    +KES {(
                                        filteredTransactions
                                            .filter(t => t.type === 'received' && t.status === 'completed')
                                            .reduce((sum, t) => sum + t.amount, 0) -
                                        filteredTransactions
                                            .filter(t => t.type === 'sent' && t.status === 'completed')
                                            .reduce((sum, t) => sum + t.amount, 0)
                                    ).toLocaleString()}
                  </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transactions List */}
                    <div className="lg:col-span-3">
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold text-slate-900">
                                        Transactions ({filteredTransactions.length})
                                    </CardTitle>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="border-slate-200">
                                                Sort by Date <ChevronDown className="w-4 h-4 ml-2" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Newest First</DropdownMenuItem>
                                            <DropdownMenuItem>Oldest First</DropdownMenuItem>
                                            <DropdownMenuItem>Highest Amount</DropdownMenuItem>
                                            <DropdownMenuItem>Lowest Amount</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredTransactions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions found</h3>
                                        <p className="text-slate-600">Try adjusting your filters to see more results</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredTransactions.map((transaction, index) => (
                                            <div key={transaction.id}>
                                                <div
                                                    className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                                    onClick={() => setSelectedTransaction(transaction)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-full ${
                                                            transaction.type === 'received'
                                                                ? 'bg-emerald-50'
                                                                : 'bg-blue-50'
                                                        }`}>
                                                            {transaction.type === 'received' ? (
                                                                <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                                                            ) : (
                                                                <ArrowUpRight className="w-5 h-5 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h3 className="font-medium text-slate-900">
                                                                {transaction.description}
                                                            </h3>
                                                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                                                <div className="flex items-center gap-1">
                                                                    {getMethodIcon(transaction.method)}
                                                                    <span>{transaction.reference}</span>
                                                                </div>
                                                                <span>•</span>
                                                                <span>{formatDateTime(transaction.timestamp)}</span>
                                                                {transaction.taskId && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>Task #{transaction.taskId}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className={`text-xs ${getStatusColor(transaction.status)}`}>
                                                                    {getStatusIcon(transaction.status)}
                                                                    <span className="ml-1">{transaction.status}</span>
                                                                </Badge>
                                                                {transaction.sender && (
                                                                    <span className="text-xs text-slate-500">
                                    from {transaction.sender}
                                  </span>
                                                                )}
                                                                {transaction.recipient && (
                                                                    <span className="text-xs text-slate-500">
                                    to {transaction.recipient}
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-semibold ${
                                                            transaction.type === 'received'
                                                                ? 'text-emerald-600'
                                                                : 'text-slate-900'
                                                        }`}>
                                                            {transaction.type === 'received' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
                                                        </p>
                                                        {transaction.fee && (
                                                            <p className="text-xs text-slate-500">
                                                                Fee: KES {transaction.fee}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {index < filteredTransactions.length - 1 && <Separator />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}