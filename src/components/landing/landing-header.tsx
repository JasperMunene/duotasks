"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    MenuIcon,
    HelpCircleIcon,
    BellIcon,
    MessageSquareIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-shadow duration-300 bg-white ${
                isScrolled ? "shadow-md" : "shadow-none"
            }`}
        >
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                {/* Left: Logo, Post Button, Nav Links */}
                <div className="flex items-center space-x-6">
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-extrabold text-emerald-600">Duotasks</span>
                    </Link>

                    <Link href="/post-task" passHref>
                        <Button className="hidden md:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white">
                            Post a Task
                        </Button>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/tasks"
                            className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                        >
                            Browse Tasks
                        </Link>
                        <Link
                            href="/my-tasks"
                            className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                        >
                            My Tasks
                        </Link>
                    </nav>
                </div>

                {/* Right: Icons, Profile & Mobile Menu Button */}
                <div className="flex items-center space-x-4">
                    {/* Only show icons on md+ */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-emerald-600">
                            <HelpCircleIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-emerald-600">
                            <BellIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-emerald-600">
                            <MessageSquareIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="p-0">
                            <Image
                                src="/avatar.jpg"
                                alt="User avatar"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </Button>
                    </div>

                    {/* Mobile menu button on right */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Toggle navigation menu"
                    >
                        <MenuIcon className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link
                            href="/tasks"
                            className="text-base font-medium text-gray-700 hover:text-emerald-600"
                        >
                            Browse Tasks
                        </Link>
                        <Link
                            href="/my-tasks"
                            className="text-base font-medium text-gray-700 hover:text-emerald-600"
                        >
                            My Tasks
                        </Link>
                        <Link
                            href="/help"
                            className="text-base font-medium text-gray-700 hover:text-emerald-600"
                        >
                            Help Center
                        </Link>
                        <Link
                            href="/messages"
                            className="text-base font-medium text-gray-700 hover:text-emerald-600"
                        >
                            Messages
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
