// SETTINGS/LAYOUT.TSX
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Phone,
    Mail,
    User,
    Shield,
    Lock,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsNavigation = [
    {
        name: 'Phone',
        href: '/settings/phone',
        icon: Phone,
        description: 'Mobile verification'
    },
    {
        name: 'Email',
        href: '/settings/email',
        icon: Mail,
        description: 'Email verification'
    },
    {
        name: 'Account',
        href: '/settings/account',
        icon: User,
        description: 'Personal details'
    },
    {
        name: 'Identity',
        href: '/settings/identity',
        icon: Shield,
        description: 'Document verification'
    },
    {
        name: 'Password',
        href: '/settings/password',
        icon: Lock,
        description: 'Security settings'
    },
];

export default function SettingsLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar when navigating
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="font-semibold text-slate-900">Settings</h2>
                </div>
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Sidebar - Mobile Drawer */}
                <div
                    className={cn(
                        "fixed lg:relative inset-y-0 left-0 z-30 w-72 lg:w-1/3 min-h-screen bg-white border-r border-slate-200 shadow-sm transform transition-transform duration-300 ease-in-out",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    )}
                >
                    <div className="p-4 lg:p-6">
                        <div className="lg:hidden flex justify-end mb-4">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-900">Jasper Munene</h2>
                                <p className="text-sm text-slate-600">Settings</p>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-2">
                            {settingsNavigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg transition-all duration-200 group",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={cn(
                                                "w-5 h-5",
                                                isActive ? "text-emerald-600" : "text-slate-500"
                                            )} />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.description}</p>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <ChevronRight className="w-4 h-4 text-emerald-600" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content Area */}
                <div className="w-full lg:w-2/3 min-h-screen">
                    <div className="p-4 lg:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}