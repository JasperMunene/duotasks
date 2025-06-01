'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Search, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LandingHeader from "@/components/landing/landing-header";
import Image from 'next/image';

const mockMessages = [
    {
        id: 1,
        user: {
            name: 'John Doe',
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2',
        },
        lastMessage: 'Hi, I\'m interested in your task. When would you like this done?',
        timestamp: '2 hours ago',
        unread: true,
        taskTitle: 'Fix my leaking tap',
    },
    {
        id: 2,
        user: {
            name: 'Jane Smith',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2',
        },
        lastMessage: 'Great, I\'ll get started right away!',
        timestamp: '1 day ago',
        unread: false,
        taskTitle: 'House Cleaning',
    },
];

export default function MessagesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const unreadMessages = mockMessages.filter(msg => msg.unread);

    return (
        <div className="min-h-screen bg-slate-50">
            <LandingHeader />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-emerald-600" />
                        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search messages"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 pl-10 pr-4 h-10 rounded-lg border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                </div>

                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="bg-slate-100 p-1 rounded-lg">
                        <TabsTrigger value="all" className="rounded-md">
                            All messages
                        </TabsTrigger>
                        <TabsTrigger value="unread" className="rounded-md">
                            Unread
                            {unreadMessages.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                                    {unreadMessages.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {mockMessages.map((message) => (
                            <MessageCard key={message.id} message={message} />
                        ))}
                    </TabsContent>

                    <TabsContent value="unread" className="space-y-4">
                        {unreadMessages.map((message) => (
                            <MessageCard key={message.id} message={message} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function MessageCard({ message }: { message: typeof mockMessages[0] }) {
    return (
        <Link href={`/messages/${message.id}`}>
            <Card className={`p-4 hover:shadow-md transition-shadow duration-200 ${
                message.unread ? 'bg-emerald-50 border-emerald-100' : 'bg-white'
            }`}>
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <Image
                            src={message.user.avatar}
                            width={128}
                            height={128}
                            alt={message.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        {message.unread && (
                            <Circle className="absolute -top-1 -right-1 w-3 h-3 fill-emerald-500 text-emerald-500" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <h3 className="font-medium text-slate-900 truncate">{message.user.name}</h3>
                            <span className="text-sm text-slate-500 whitespace-nowrap ml-4">
                {message.timestamp}
              </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{message.taskTitle}</p>
                        <p className="text-sm text-slate-500 mt-1 truncate">{message.lastMessage}</p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}