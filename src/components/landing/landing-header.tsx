'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    MenuIcon,
    HelpCircleIcon,
    BellIcon,
    MessageSquareIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LandingHeader() {
    const pathname = usePathname();

    const isBrowse = pathname === '/tasks';
    const isMyTasks = pathname === '/my-tasks';
    const isNotifications = pathname === '/account/notifications';
    const isMessages = pathname === '/messages';

    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const linkClass = (active: boolean) =>
        `text-sm font-medium transition-colors ${
            active ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
        }`;

    const iconClass = (active: boolean) =>
        `p-2 rounded-md transition-colors ${
            active
                ? 'bg-emerald-100 text-emerald-600'
                : 'text-gray-600 hover:bg-emerald-600 hover:text-white'
        }`;

    return (
        <header
            className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
                isScrolled ? 'shadow-md' : 'shadow-none'
            }`}
        >
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                {/* Left */}
                <div className="flex items-center space-x-6">
                    <Link href="/" className="text-2xl font-extrabold text-emerald-600">
                        Duotasks
                    </Link>

                    <Link href="/post-task">
                        <Button className="hidden md:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white">
                            Post a Task
                        </Button>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/tasks" className={linkClass(isBrowse)}>
                            Browse Tasks
                        </Link>
                        <Link href="/my-tasks" className={linkClass(isMyTasks)}>
                            My Tasks
                        </Link>
                    </nav>
                </div>

                {/* Right */}
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className={iconClass(false)}>
                            <HelpCircleIcon className="h-5 w-5" />
                        </Button>

                        <Link href="/account/notifications">
                            <Button variant="ghost" size="icon" className={iconClass(isNotifications)}>
                                <BellIcon className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href="/messages">
                            <Button variant="ghost" size="icon" className={iconClass(isMessages)}>
                                <MessageSquareIcon className="h-5 w-5" />
                            </Button>
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                                    <Image
                                        src="/avatar.jpg"
                                        alt="User avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <div className="px-2 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/avatar.jpg"
                                            alt="User avatar"
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">Jasper Munene</p>
                                            <p className="text-xs text-slate-500">Public Profile</p>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    My Tasker Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Payment history
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Payment methods
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center justify-between">
                                        Settings
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>Email</DropdownMenuItem>
                                        <DropdownMenuItem>Mobile</DropdownMenuItem>
                                        <DropdownMenuItem>Password</DropdownMenuItem>
                                        <DropdownMenuItem>Account verification</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center justify-between">
                                        Discover
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>Categories</DropdownMenuItem>
                                        <DropdownMenuItem>How it works</DropdownMenuItem>
                                        <DropdownMenuItem>Success stories</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Toggle navigation menu"
                    >
                        <MenuIcon className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link href="/tasks" className={linkClass(isBrowse)}>
                            Browse Tasks
                        </Link>
                        <Link href="/my-tasks" className={linkClass(isMyTasks)}>
                            My Tasks
                        </Link>
                        <Link href="/help" className={linkClass(false)}>
                            Help Center
                        </Link>
                        <Link href="/messages" className={linkClass(isMessages)}>
                            Messages
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}