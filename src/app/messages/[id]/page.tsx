'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Image as ImageIcon, Paperclip,  MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';

const mockChat = {
    user: {
        name: 'John Doe',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2',
        rating: 4.8,
        completedTasks: 127,
        status: 'online',
    },
    task: {
        title: 'Fix my leaking tap',
        status: 'In Progress',
        budget: 120,
        dueDate: 'Tomorrow, 9:00 AM',
        location: 'Karen, Nairobi',
    },
    messages: [
        {
            id: 1,
            sender: 'them',
            content: "Hi, I'm interested in your task. When would you like this done?",
            timestamp: '2:30 PM',
        },
        {
            id: 2,
            sender: 'me',
            content: "Hello! I'd like to get this fixed as soon as possible. Are you available tomorrow?",
            timestamp: '2:32 PM',
        },
        {
            id: 3,
            sender: 'them',
            content: 'Yes, I can come tomorrow morning. Would 9 AM work for you?',
            timestamp: '2:33 PM',
        },
    ],
};

export default function ChatPage() {
    const [newMessage, setNewMessage] = useState('');

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/messages">
                                <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Image
                                        src={mockChat.user.avatar}
                                        width={128}
                                        height={128}
                                        alt={mockChat.user.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-semibold text-slate-900">{mockChat.user.name}</h2>
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs">
                                            Online
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      ⭐️ {mockChat.user.rating}
                    </span>
                                        <span>•</span>
                                        <span>{mockChat.user.completedTasks} tasks</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                {/*<Phone className="h-5 w-5 text-slate-600" />*/}
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                {/*<Video className="h-5 w-5 text-slate-600" />*/}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                        <MoreVertical className="h-5 w-5 text-slate-600" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View profile</DropdownMenuItem>
                                    <DropdownMenuItem>Block user</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Report issue</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* Task Info */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="font-medium text-slate-900">{mockChat.task.title}</h3>
                            <div className="flex items-center gap-3 text-sm">
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    {mockChat.task.status}
                                </Badge>
                                <span className="text-slate-600">
                   KES {mockChat.task.budget}
                </span>
                                <span className="text-slate-600">
                   {mockChat.task.location}
                </span>
                                <span className="text-slate-600">
                  {mockChat.task.dueDate}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {mockChat.messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] space-y-2 ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
                                {message.sender === 'them' && (
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={mockChat.user.avatar}
                                            width={64}
                                            height={64}
                                            alt={mockChat.user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    </div>
                                )}
                                <div
                                    className={`p-4 rounded-2xl shadow-sm ${
                                        message.sender === 'me'
                                            ? 'bg-emerald-600 text-white ml-auto'
                                            : 'bg-white border border-slate-200'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                    <span
                                        className={`block mt-1 text-xs ${
                                            message.sender === 'me' ? 'text-emerald-100' : 'text-slate-500'
                                        }`}
                                    >
                    {message.timestamp}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Message Input */}
            <footer className="bg-white border-t border-slate-200 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-emerald-50 hover:text-emerald-600 border-slate-200"
                        >
                            <ImageIcon className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-emerald-50 hover:text-emerald-600 border-slate-200"
                        >
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <div className="flex-1 relative">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="pr-12 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <Button
                                size="icon"
                                disabled={!newMessage.trim()}
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}