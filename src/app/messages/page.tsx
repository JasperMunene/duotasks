'use client';

import { useState, useRef, useEffect } from 'react';

import {
    Search,
    Send,
    Paperclip,
    Image as ImageIcon,
    Phone,
    Video,
    MoreVertical,
    Check,
    CheckCheck,
    Clock,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import LandingHeader from "@/components/landing/landing-header";

interface Message {
    id: number;
    senderId: string;
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'file';
    attachmentUrl?: string;
    attachmentName?: string;
}

interface Conversation {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string;
        isOnline: boolean;
        lastSeen?: Date;
    };
    task: {
        id: string;
        title: string;
        budget: number;
        status: 'open' | 'assigned' | 'in-progress' | 'completed';
    };
    lastMessage: Message;
    unreadCount: number;
    messages: Message[];
}

const mockConversations: Conversation[] = [
    {
        id: '1',
        user: {
            id: 'user1',
            name: 'John Doe',
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2',
            isOnline: true,
        },
        task: {
            id: 'task1',
            title: 'Fix my leaking tap',
            budget: 120,
            status: 'in-progress',
        },
        lastMessage: {
            id: 1,
            senderId: 'user1',
            content: "I'll be there at 9 AM tomorrow. Do you have the necessary tools?",
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            status: 'read',
            type: 'text',
        },
        unreadCount: 2,
        messages: [
            {
                id: 1,
                senderId: 'me',
                content: "Hi John! Thanks for accepting my task. When can you come over?",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                status: 'read',
                type: 'text',
            },
            {
                id: 2,
                senderId: 'user1',
                content: "Hello! I can come tomorrow morning. Would 9 AM work for you?",
                timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
                status: 'read',
                type: 'text',
            },
            {
                id: 3,
                senderId: 'me',
                content: "Perfect! 9 AM works great. Do you need me to provide any tools?",
                timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                status: 'read',
                type: 'text',
            },
            {
                id: 4,
                senderId: 'user1',
                content: "I'll be there at 9 AM tomorrow. Do you have the necessary tools?",
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                status: 'read',
                type: 'text',
            },
        ],
    },
    {
        id: '2',
        user: {
            id: 'user2',
            name: 'Sarah Wilson',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2',
            isOnline: false,
            lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        },
        task: {
            id: 'task2',
            title: 'House Cleaning',
            budget: 200,
            status: 'open',
        },
        lastMessage: {
            id: 5,
            senderId: 'user2',
            content: "I'm interested in your house cleaning task. What's the size of the house?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            status: 'delivered',
            type: 'text',
        },
        unreadCount: 1,
        messages: [
            {
                id: 5,
                senderId: 'user2',
                content: "I'm interested in your house cleaning task. What's the size of the house?",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
                status: 'delivered',
                type: 'text',
            },
        ],
    },
    {
        id: '3',
        user: {
            id: 'user3',
            name: 'Mike Chen',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2',
            isOnline: true,
        },
        task: {
            id: 'task3',
            title: 'Website Development',
            budget: 3000,
            status: 'assigned',
        },
        lastMessage: {
            id: 6,
            senderId: 'me',
            content: "Thanks for the update! The design looks great.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            status: 'read',
            type: 'text',
        },
        unreadCount: 0,
        messages: [
            {
                id: 6,
                senderId: 'me',
                content: "Thanks for the update! The design looks great.",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                status: 'read',
                type: 'text',
            },
        ],
    },
];

export default function MessagesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
    const [newMessage, setNewMessage] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredConversations = mockConversations.filter(conv =>
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const message: Message = {
            id: Date.now(),
            senderId: 'me',
            content: newMessage,
            timestamp: new Date(),
            status: 'sent',
            type: 'text',
        };

        // In a real app, you'd send this to your backend
        selectedConversation.messages.push(message);
        setNewMessage('');
        scrollToBottom();
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString();
    };

    const formatMessageTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusIcon = (status: Message['status']) => {
        switch (status) {
            case 'sent':
                return <Check className="w-4 h-4 text-slate-400" />;
            case 'delivered':
                return <CheckCheck className="w-4 h-4 text-slate-400" />;
            case 'read':
                return <CheckCheck className="w-4 h-4 text-emerald-500" />;
            default:
                return <Clock className="w-4 h-4 text-slate-400" />;
        }
    };

    const getTaskStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'assigned':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'in-progress':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed':
                return 'bg-slate-50 text-slate-700 border-slate-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    // Mobile view - show conversation list or chat
    if (isMobileView) {
        if (selectedConversation && selectedConversation.id) {
            return (
                <div className="h-screen flex flex-col bg-white">
                    {/* Mobile Chat Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedConversation(null)}
                            className="hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="relative">
                            <img
                                src={selectedConversation.user.avatar}
                                alt={selectedConversation.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            {selectedConversation.user.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{selectedConversation.user.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{selectedConversation.task.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                <Phone className="w-5 h-5 text-slate-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                <Video className="w-5 h-5 text-slate-600" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Messages */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {selectedConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex",
                                        message.senderId === 'me' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                                            message.senderId === 'me'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-white border border-slate-200'
                                        )}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        <div className={cn(
                                            "flex items-center gap-1 mt-1",
                                            message.senderId === 'me' ? 'justify-end' : 'justify-start'
                                        )}>
                      <span className={cn(
                          "text-xs",
                          message.senderId === 'me' ? 'text-emerald-100' : 'text-slate-500'
                      )}>
                        {formatMessageTime(message.timestamp)}
                      </span>
                                            {message.senderId === 'me' && (
                                                <div className="ml-1">
                                                    {getStatusIcon(message.status)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Mobile Message Input */}
                    <div className="p-4 border-t border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                <Paperclip className="w-5 h-5 text-slate-600" />
                            </Button>
                            <div className="flex-1 relative">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="pr-12 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Mobile conversation list
        return (
            <div className="h-screen bg-slate-50">
                <LandingHeader />
                <div className="bg-white border-b border-slate-200 p-4">
                    <h1 className="text-xl font-bold text-slate-900 mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="divide-y divide-slate-100">
                        {filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => setSelectedConversation(conversation)}
                                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <img
                                            src={conversation.user.avatar}
                                            alt={conversation.user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        {conversation.user.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900 truncate">{conversation.user.name}</h3>
                                            <span className="text-xs text-slate-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 truncate">{conversation.task.title}</p>
                                        <p className="text-sm text-slate-500 truncate mt-1">{conversation.lastMessage.content}</p>
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                        <Badge className="bg-emerald-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                            {conversation.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        );
    }

    // Desktop view
    return (
        <>
        <LandingHeader />
        <div className="h-screen flex bg-white">
            {/* Left Panel - Conversations List */}
            <div className="w-1/4 border-r border-slate-200 flex flex-col bg-white">
                {/* Header */}
                <div className="p-4 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-slate-900 mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <ScrollArea className="flex-1">
                    <div className="divide-y divide-slate-100">
                        {filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => setSelectedConversation(conversation)}
                                className={cn(
                                    "p-4 hover:bg-slate-50 cursor-pointer transition-colors",
                                    selectedConversation?.id === conversation.id && "bg-emerald-50 border-r-2 border-emerald-500"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <img
                                            src={conversation.user.avatar}
                                            alt={conversation.user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        {conversation.user.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-slate-900 truncate">{conversation.user.name}</h3>
                                            <span className="text-xs text-slate-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                                        </div>
                                        <p className="text-sm text-emerald-600 truncate mb-1">#{conversation.task.id} - {conversation.task.title}</p>
                                        <p className="text-sm text-slate-500 truncate">{conversation.lastMessage.content}</p>
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                        <Badge className="bg-emerald-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                            {conversation.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Panel - Chat Interface */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-200 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={selectedConversation.user.avatar}
                                            alt={selectedConversation.user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        {selectedConversation.user.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-900">{selectedConversation.user.name}</h2>
                                        <p className="text-sm text-slate-500">
                                            {selectedConversation.user.isOnline ? 'Online' : `Last seen ${formatTime(selectedConversation.user.lastSeen || new Date())}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                        <Phone className="w-5 h-5 text-slate-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                        <Video className="w-5 h-5 text-slate-600" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                                <MoreVertical className="w-5 h-5 text-slate-600" />
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

                            {/* Task Info Card */}
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-slate-900">{selectedConversation.task.title}</h3>
                                        <p className="text-sm text-slate-600">Task #{selectedConversation.task.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-emerald-600">KES {selectedConversation.task.budget}</p>
                                        <Badge variant="outline" className={getTaskStatusColor(selectedConversation.task.status)}>
                                            {selectedConversation.task.status.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4 bg-slate-50">
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {selectedConversation.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex",
                                            message.senderId === 'me' ? 'justify-end' : 'justify-start'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                                                message.senderId === 'me'
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-white border border-slate-200'
                                            )}
                                        >
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                            <div className={cn(
                                                "flex items-center gap-1 mt-2",
                                                message.senderId === 'me' ? 'justify-end' : 'justify-start'
                                            )}>
                        <span className={cn(
                            "text-xs",
                            message.senderId === 'me' ? 'text-emerald-100' : 'text-slate-500'
                        )}>
                          {formatMessageTime(message.timestamp)}
                        </span>
                                                {message.senderId === 'me' && (
                                                    <div className="ml-1">
                                                        {getStatusIcon(message.status)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex items-center gap-3 max-w-4xl mx-auto">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="hover:bg-emerald-50 hover:text-emerald-600 border-slate-200"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="hover:bg-emerald-50 hover:text-emerald-600 border-slate-200"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </Button>
                                <div className="flex-1 relative">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="pr-12 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        // Handle file upload
                                        console.log('File selected:', e.target.files?.[0]);
                                    }}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    // No conversation selected
                    <div className="flex-1 flex items-center justify-center bg-slate-50">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a conversation</h3>
                            <p className="text-slate-600">Choose a conversation from the list to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}