"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LandingHeader from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import Link from "next/link";
import {
    BriefcaseIcon,
    HeadingIcon as CleaningIcon,
    ComputerIcon,
    HomeIcon,
    PaintbrushIcon,
    ShoppingBagIcon,
    PenToolIcon as ToolIcon,
    WrenchIcon,
    ArrowRight,
    House,
    PaintRoller,
    Wrench,
    CarFront,
} from "lucide-react";

const categories = [
    { icon: <BriefcaseIcon className="h-6 w-6" />, name: "Business & Admin" },
    { icon: <ComputerIcon className="h-6 w-6" />, name: "Computers & IT" },
    { icon: <ToolIcon className="h-6 w-6" />, name: "Furniture Assembly" },
    { icon: <WrenchIcon className="h-6 w-6" />, name: "Handyman" },
    { icon: <PaintbrushIcon className="h-6 w-6" />, name: "Marketing & Design" },
    { icon: <ShoppingBagIcon className="h-6 w-6" />, name: "Events & Photography" },
    { icon: <HomeIcon className="h-6 w-6" />, name: "Home & Gardening" },
    { icon: <CleaningIcon className="h-6 w-6" />, name: "Cleaning" },
];

const popularTasks = [
    { icon: <House />, label: "Help me move home" },
    { icon:  <PaintRoller />, label: "Paint my house" },
    { icon: <Wrench />, label: "Fix my washing machine" },
    { icon: <CarFront />, label: "Mow my backyard" },
    { icon: "⋯", label: "More inspiration" },
];

export default function Home() {
    const [userName, setUserName] = useState("");
    const [greeting, setGreeting] = useState<string>("");

    useEffect(() => {
        // Simulate fetching user data
        setUserName("Jasper");

        // Time-based greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <LandingHeader />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-emerald-600 py-24 px-4 overflow-hidden">
                    {/* Optional decorative shapes */}
                    <div className="absolute inset-0 opacity-20 bg-[url('/hero-pattern.svg')] bg-cover"></div>

                    <div className="relative max-w-5xl mx-auto text-center space-y-6">
                        <p className="text-emerald-100 text-lg font-medium">
                            {greeting}, {userName}
                        </p>
                        <h1 className="text-white text-4xl md:text-5xl font-extrabold">
                            Post a task. Get it done.
                        </h1>

                        <div className="relative mt-6 max-w-3xl mx-auto">
                            <Input
                                type="text"
                                placeholder="In a few words, what do you need done?"
                                className="w-full text-black h-14 pl-6 pr-40 text-lg rounded-2xl shadow-lg focus:ring-2 focus:ring-emerald-400 border-white bg-white placeholder-gray-600"
                            />
                            <Link href="/post-task">
                            <Button className="absolute right-2 top-1/2 -translate-y-1/2  text-white bg-emerald-800 font-semibold px-6 py-3 rounded-full hover:bg-emerald-700 transition">
                                Get Offers <ArrowRight />
                            </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {popularTasks.map((task, idx) => (
                                <Button
                                    key={idx}
                                    variant="outline"
                                    className="bg-emerald-600 rounded-full border-white text-white hover:bg-white hover:text-emerald-600 transition inline-flex items-center space-x-2 px-4 py-2"
                                >
                                    <span>{task.icon}</span>
                                    <span>{task.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12 text-center">
                        Get it done today
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                                    {category.icon}
                                </div>
                                <span className="text-base font-medium text-gray-700">
                  {category.name}
                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <h3 className="text-lg text-gray-600 mb-6">
                            Can’t find what you need?
                        </h3>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium">
                            Post a task & get offers
                        </Button>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}