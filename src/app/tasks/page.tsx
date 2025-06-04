'use client';

import { useState } from 'react';
import { MapPin, Clock, Calendar, ChevronDown, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import TaskMap from '@/components/Task/TaskMap';
import LandingHeader from "@/components/landing/landing-header";
import CategoryFilter from "@/components/Filter/CategoryFilter";
import LocationFilter from "@/components/Filter/LocationFilter";
import PriceFilter from "@/components/Filter/PriceFilter";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const mockTasks = [
    {
        id: 1,
        title: 'Fix my leaking tap',
        location: 'Westlands, Nairobi',
        budget: 120,
        date: 'Flexible',
        offers: 3,
        status: 'Open',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        timeSlot: 'Anytime',
    },
    {
        id: 2,
        title: 'House Cleaning',
        location: 'Kilimani, Nairobi',
        budget: 200,
        date: 'Before Sun, 1 Jun',
        offers: 5,
        status: 'Open',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        timeSlot: 'Anytime',
    },
    {
        id: 3,
        title: 'Website Development',
        location: 'Remote',
        budget: 3000,
        date: 'Flexible',
        offers: 8,
        status: 'Open',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        timeSlot: 'Anytime',
    },
    {
        id: 4,
        title: 'Plumbing',
        location: 'Kilimani, Nairobi',
        budget: 200,
        date: 'Before Sun, 1 Jun',
        offers: 5,
        status: 'Open',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        timeSlot: 'Anytime',
    },
    {
        id: 5,
        title: 'Mount my tv',
        location: 'Kilimani, Nairobi',
        budget: 200,
        date: 'Before Sun, 1 Jun',
        offers: 5,
        status: 'Open',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        timeSlot: 'Anytime',
    },
];

export default function BrowseTasks() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [location, setLocation] = useState({
        type: 'all' as const,
        suburb: 'Karen, Nairobi',
        distance: 100,
    });

    const [priceRange, setPriceRange] = useState<{ min: number; max: number | null }>({
        min: 0,
        max: null,
    });


    const getLocationText = () => {
        if (location.type === 'remotely') return 'Remote only';
        if (location.type === 'all') return `${location.distance}km+ ${location.suburb} & remotely`;
        return `${location.distance}km+ ${location.suburb}`;
    };


    const getPriceText = () => {
        if (priceRange.min === 0 && priceRange.max === null) return 'Any price';
        if (priceRange.max === null) return `$${priceRange.min}+`;
        return `$${priceRange.min} - $${priceRange.max}`;
    };


    return (
        <div className="min-h-screen bg-slate-50">
            <LandingHeader />
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search for a task"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-10 h-10 rounded-full bg-gray-50 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </button>
                        </div>

                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                            <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-10">
                                        Category <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[400px]">
                                    <CategoryFilter
                                        initialSelected={[]}
                                        onCancel={() => setIsCategoryOpen(false)}
                                        onApply={() => setIsCategoryOpen(false)}
                                    />
                                </PopoverContent>
                            </Popover>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-10">
                                        {getLocationText()}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="start" className="p-0">
                                    <LocationFilter
                                        initialValues={location}
                                        onCancel={() => {/* close menu */}}
                                        onApply={(newLocation) => {
                                            setLocation(newLocation);
                                        }}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-10">
                                        {getPriceText()}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="start" className="p-0">
                                    <PriceFilter
                                        initialValues={priceRange}
                                        onCancel={() => {/* close menu */}}
                                        onApply={(newRange) => {
                                            setPriceRange(newRange);
                                        }}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button variant="outline" className="h-10">
                                <Filter className="h-4 w-4 mr-2" />
                                Other Filters
                            </Button>

                            <Button variant="outline" className="h-10">
                                <SortAsc className="h-4 w-4 mr-2" />
                                Sort
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Task List */}
                    <div className="space-y-4">
                        {mockTasks.map((task) => (
                            <Card
                                key={task.id}
                                className="p-4 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                            >
                                {/* Top row: title + budget */}
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
                                    <span className="text-base font-bold text-emerald-600">KES {task.budget}</span>
                                </div>

                                {/* Middle rows: three lines of icon + text */}
                                <div className="mt-3 space-y-2 text-sm text-slate-600">
                                    {/* location */}
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                        <span>{task.location}</span>
                                    </div>

                                    {/* date (uses Clock icon) */}
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                                        <span>{task.date}</span>
                                    </div>

                                    {/* time or “Anytime” */}
                                    <div className="flex items-center">
                                        {/* you can swap Clock for another icon if you like */}
                                        <Clock className="w-4 h-4 mr-1 text-slate-400" />
                                        <span>{task.timeSlot ?? 'Anytime'}</span>
                                    </div>
                                </div>

                                {/* Bottom row: status • offers + avatar */}
                                <div className="mt-4 flex justify-between items-center text-sm">
      <span className="font-medium text-emerald-600">
        {task.status} • {task.offers} offer{task.offers > 1 ? 's' : ''}
      </span>
                                    <Image
                                        src={task.avatarUrl}
                                        width={36}
                                        height={36}
                                        alt=""
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                </div>
                            </Card>
                        ))}

                    </div>

                    {/* Map */}
                    <div className="hidden lg:block h-[calc(100vh-12rem)] sticky top-24">
                        <TaskMap />
                    </div>
                </div>
            </div>
        </div>
    );
}