'use client';

import { useState } from 'react';
import { MapPin, Clock, ChevronDown, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import TaskMap from '@/components/Task/TaskMap';
import LandingHeader from "@/components/landing/landing-header";

const mockTasks = {
    posted: [
        {
            id: 1,
            title: 'Fix my leaking tap',
            location: 'Perth WA, Australia',
            budget: 120,
            date: 'Flexible',
            offers: 3,
            status: 'Open',
        },
        {
            id: 2,
            title: 'House Cleaning',
            location: 'Fremantle WA, Australia',
            budget: 200,
            date: 'Before Sun, 1 Jun',
            offers: 5,
            status: 'Open',
        },
    ],
    assigned: [
        {
            id: 3,
            title: 'Website Development',
            location: 'Remote',
            budget: 3000,
            date: 'Flexible',
            offers: 8,
            status: 'In Progress',
        },
    ],
    completed: [
        {
            id: 4,
            title: 'Garden Maintenance',
            location: 'Perth WA, Australia',
            budget: 150,
            date: 'Completed on May 15',
            offers: 4,
            status: 'Completed',
        },
    ],
};

export default function MyTasks() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedLocation, setSelectedLocation] = useState('100km+ Perth WA & remotely');
    const [selectedPrice, setSelectedPrice] = useState('Any price');

    const TaskList = ({ tasks }: { tasks: typeof mockTasks.posted }) => (
        <div className="space-y-4">
            {tasks.map((task) => (
                <Card key={task.id} className="p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                            <div className="flex items-center text-sm text-slate-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {task.location}
                            </div>
                            <div className="flex items-center text-sm text-slate-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {task.date}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">${task.budget}</div>
                            <Badge variant="secondary" className="mt-2">
                                {task.offers} offers
                            </Badge>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <Badge
                            variant="outline"
                            className={`
                ${task.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                ${task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                ${task.status === 'Completed' ? 'bg-slate-50 text-slate-700 border-slate-200' : ''}
              `}
                        >
                            {task.status}
                        </Badge>
                    </div>
                </Card>
            ))}
        </div>
    );

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
                                placeholder="Search your tasks"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-10 h-10 rounded-lg border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="h-10">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>

                            <Button variant="outline" className="h-10">
                                <SortAsc className="h-4 w-4 mr-2" />
                                Sort
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="mt-4">
                        <TabsList className="bg-slate-100">
                            <TabsTrigger value="all">All tasks</TabsTrigger>
                            <TabsTrigger value="posted">Posted tasks</TabsTrigger>
                            <TabsTrigger value="assigned">Tasks assigned</TabsTrigger>
                            <TabsTrigger value="completed">Tasks completed</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Task Lists */}
                    <div>
                        <Tabs defaultValue="all" className="space-y-4">
                            <TabsContent value="all">
                                <TaskList tasks={[...mockTasks.posted, ...mockTasks.assigned, ...mockTasks.completed]} />
                            </TabsContent>
                            <TabsContent value="posted">
                                <TaskList tasks={mockTasks.posted} />
                            </TabsContent>
                            <TabsContent value="assigned">
                                <TaskList tasks={mockTasks.assigned} />
                            </TabsContent>
                            <TabsContent value="completed">
                                <TaskList tasks={mockTasks.completed} />
                            </TabsContent>
                        </Tabs>
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