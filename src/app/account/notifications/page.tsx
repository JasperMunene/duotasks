'use client';

import Link from 'next/link';
import { Bell, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LandingHeader from "@/components/landing/landing-header";

const mockNotifications = [
    {
        id: 1,
        title: 'New offer on your task',
        description: 'John D. has made an offer of $120 for "Fix my leaking tap"',
        time: '2 hours ago',
        isRead: false,
    },
    {
        id: 2,
        title: 'Task completed',
        description: 'Your task "House Cleaning" has been marked as completed',
        time: '1 day ago',
        isRead: true,
    },
];

export default function NotificationsPage() {
    const hasNotifications = mockNotifications.length > 0;

    return (
        <div className="min-h-screen bg-slate-50">
            <LandingHeader />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Bell className="h-6 w-6 text-emerald-600" />
                        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                    </div>
                    {hasNotifications && (
                        <Button
                            variant="outline"
                            className="text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                {hasNotifications ? (
                    <div className="space-y-4">
                        {mockNotifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`p-4 transition-all duration-200 hover:shadow-md ${
                                    !notification.isRead ? 'bg-emerald-50 border-emerald-100' : 'bg-white'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {!notification.isRead && (
                                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                                    )}
                                    <div className="flex-1">
                                        <h3 className={`font-medium ${!notification.isRead ? 'text-emerald-900' : 'text-slate-900'}`}>
                                            {notification.title}
                                        </h3>
                                        <p className="mt-1 text-slate-600">{notification.description}</p>
                                        <span className="mt-2 text-sm text-slate-500 block">{notification.time}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
                            <Bell className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-3">No notifications yet</h2>
                        <p className="text-slate-600 mb-8">
                            Get started by posting a task or browsing available tasks
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/post-task">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow group">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Post a Task
                                </Button>
                            </Link>
                            <Link href="/browse">
                                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 group">
                                    <Search className="w-4 h-4 mr-2" />
                                    Browse Tasks
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}