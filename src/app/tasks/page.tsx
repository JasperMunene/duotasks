"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, Clock, Calendar, ChevronDown, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import TaskMap from "@/components/Task/TaskMap";
import LandingHeader from "@/components/landing/landing-header";
import CategoryFilter from "@/components/Filter/CategoryFilter";
import LocationFilter from "@/components/Filter/LocationFilter";
import PriceFilter from "@/components/Filter/PriceFilter";
import SortFilter, { type SortOption } from "@/components/Filter/SortFilter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

type LocationMode = "all" | "remotely" | "in-person";

interface Location {
  type: LocationMode;
  town: string;
  distance: number;
  lat?: number;
  lng?: number;
}

interface Task {
  id: number;
  title: string;
  location: {
    city: string;
    latitude?: number;
    longitude?: number;
  } | null;
  budget: number;
  schedule_type: string;
  specific_date?: string;
  deadline_date?: string;
  preferred_time?: string;
  status: string;
  user: {
    id: number;
    name: string;
    image: string;
  };
  categories: Array<{ id: number; name: string }>;
  created_at: string;
  distance?: number;
}

interface ApiResponse {
  tasks: Task[];
  next_cursor: string | null;
}

interface MapTask {
  id: number;
  title: string;
  position: {
    lat: number;
    lng: number;
  };
}

export default function BrowseTasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [location, setLocation] = useState<Location>({
    type: "all",
    town: "",
    distance: 100,
  });
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number | null }>({
    min: 0,
    max: null,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [mapTasks, setMapTasks] = useState<MapTask[]>([]);

  // Refs for stable access in callbacks
  const cursorRef = useRef(cursor);
  const hasMoreRef = useRef(hasMore);
  const isFetchingRef = useRef(isFetchingMore);
  const filtersRef = useRef({
    sortOption,
    selectedCategories,
    priceRange,
    location
  });

  // Keep refs updated
  useEffect(() => {
    cursorRef.current = cursor;
    hasMoreRef.current = hasMore;
    isFetchingRef.current = isFetchingMore;
    filtersRef.current = {
      sortOption,
      selectedCategories,
      priceRange,
      location
    };
  }, [cursor, hasMore, isFetchingMore, sortOption, selectedCategories, priceRange, location]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastTaskRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting &&
          hasMoreRef.current &&
          !isFetchingRef.current) {
        fetchTasks(true);
      }
    }, { threshold: 0.1 });

    if (node) observer.current.observe(node);
  }, []);

  const getLocationText = () => {
    if (location.type === "remotely") return "Remote only";
    if (location.type === "all")
      return `${location.distance}km+ ${location.town} & remotely`;
    return `${location.distance}km+ ${location.town}`;
  };

  const getPriceText = () => {
    if (priceRange.min === 0 && priceRange.max === null) return "Any price";
    if (priceRange.max === null) return `KES ${priceRange.min}+`;
    return `KES ${priceRange.min} - KES ${priceRange.max}`;
  };

  // Map frontend sort options to backend values
  const getBackendSort = (option: SortOption): string => {
    switch (option) {
      case "recommended": return "recommended";
      case "recent": return "recent";
      case "due-soon": return "due_date";
      case "closest": return "distance";
      case "price-high": return "price";
      default: return "recent";
    }
  };

  const fetchTasks = useCallback(async (loadMore = false) => {
    if (loadMore) {
      if (!cursorRef.current || isFetchingRef.current) return;
      setIsFetchingMore(true);
    } else {
      setTasks([]);
      setCursor(null);
      setHasMore(true);
      setLoading(true);
      setMapTasks([]);
    }

    try {
      const params = new URLSearchParams({
        sort: getBackendSort(filtersRef.current.sortOption),
        limit: "10",
      });

      if (cursorRef.current) params.append("cursor", cursorRef.current);
      if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);

      // Category filter
      if (filtersRef.current.selectedCategories.length > 0) {
        filtersRef.current.selectedCategories.forEach(id =>
            params.append("category_ids", id.toString())
        );
      }

      // Price filter
      if (filtersRef.current.priceRange.min !== 0)
        params.append("min_price", filtersRef.current.priceRange.min.toString());
      if (filtersRef.current.priceRange.max !== null)
        params.append("max_price", filtersRef.current.priceRange.max.toString());

      // Location filters
      if (filtersRef.current.location.type !== "all") {
        params.append("work_mode",
            filtersRef.current.location.type === "remotely" ? "remote" : "physical"
        );
      }

      if (filtersRef.current.location.town) {
        params.append("city", filtersRef.current.location.town);
        params.append("radius", filtersRef.current.location.distance.toString());
      }

      // Add coordinates if available
      if (filtersRef.current.location.lat && filtersRef.current.location.lng) {
        params.append("lat", filtersRef.current.location.lat.toString());
        params.append("lon", filtersRef.current.location.lng.toString());
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/tasks?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      setTasks(prev => loadMore ? [...prev, ...data.tasks] : data.tasks);
      setCursor(data.next_cursor);
      setHasMore(data.next_cursor !== null);

      // Prepare tasks for map
      const newMapTasks = data.tasks
          .filter(task => task.location?.latitude && task.location?.longitude)
          .map(task => ({
            id: task.id,
            title: task.title,
            position: {
              lat: parseFloat(task.location!.latitude!.toString()),
              lng: parseFloat(task.location!.longitude!.toString()),
            },
          }));

      setMapTasks(prev => loadMore ? [...prev, ...newMapTasks] : newMapTasks);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [debouncedSearchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    debouncedSearchQuery,
    selectedCategories,
    priceRange,
    location,
    sortOption
  ]);

  const formatTaskDate = (task: Task) => {
    if (task.schedule_type === "specific_day" && task.specific_date) {
      return format(parseISO(task.specific_date), "EEE, d MMM");
    }
    if (task.schedule_type === "before_day" && task.deadline_date) {
      return `Before ${format(parseISO(task.deadline_date), "EEE, d MMM")}`;
    }
    return "Flexible";
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setLocation({ type: "all", town: "", distance: 100 });
    setPriceRange({ min: 0, max: null });
    setSortOption("recent");
  };

  return (
      <div className="min-h-screen bg-slate-50">
        <LandingHeader />
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
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-10 flex-none min-w-[160px] truncate"
                    >
                      Category <ChevronDown className="ml-2 h-4 w-4" />
                      {selectedCategories.length > 0 && (
                          <span className="ml-2 text-xs font-semibold">
                        ({selectedCategories.length})
                      </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[400px]">
                    <CategoryFilter
                        initialSelected={selectedCategories.map(String)}
                        onCancel={() => setIsCategoryOpen(false)}
                        onApply={(categories) => {
                          setSelectedCategories(categories.map(Number));
                          setIsCategoryOpen(false);
                        }}
                    />
                  </PopoverContent>
                </Popover>

                <DropdownMenu
                    open={isLocationOpen}
                    onOpenChange={setIsLocationOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-10 flex-none min-w-[180px] truncate"
                    >
                      {getLocationText()}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      side="bottom"
                      align="start"
                      className="p-0"
                  >
                    <LocationFilter
                        initialValues={location}
                        onCancel={() => setIsLocationOpen(false)}
                        onApply={(newLocation) => {
                          setLocation(newLocation);
                          setIsLocationOpen(false);
                        }}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu open={isPriceOpen} onOpenChange={setIsPriceOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-10 flex-none min-w-[160px] truncate"
                    >
                      {getPriceText()}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      side="bottom"
                      align="start"
                      className="p-0"
                  >
                    <PriceFilter
                        initialValues={priceRange}
                        onCancel={() => setIsPriceOpen(false)}
                        onApply={(newRange) => {
                          setPriceRange(newRange);
                          setIsPriceOpen(false);
                        }}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-10 flex-none min-w-[160px] truncate"
                    >
                      <SortAsc className="h-4 w-4 mr-2" />
                      {sortOption === "recommended" && "Recommended"}
                      {sortOption === "recent" && "Most recent"}
                      {sortOption === "due-soon" && "Due soon"}
                      {sortOption === "closest" && "Closest"}
                      {sortOption === "price-high" && "Highest price"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      side="bottom"
                      align="start"
                      className="p-0"
                  >
                    <SortFilter
                        initialValue={sortOption}
                        onApply={(option) => {
                          setSortOption(option);
                          setIsSortOpen(false);
                        }}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                <p className="font-medium">Error loading tasks</p>
                <p className="text-sm mt-1">{error}</p>
                <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => fetchTasks()}
                >
                  Retry
                </Button>
              </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task List */}
            <div className="space-y-4">
              {loading && !isFetchingMore ? (
                  Array.from({ length: 5 }).map((_, i) => (
                      <Card key={i} className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Skeleton className="h-4 w-4 mr-2" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="flex items-center">
                              <Skeleton className="h-4 w-4 mr-2" />
                              <Skeleton className="h-4 w-1/3" />
                            </div>
                            <div className="flex items-center">
                              <Skeleton className="h-4 w-4 mr-2" />
                              <Skeleton className="h-4 w-1/4" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-9 w-9 rounded-full" />
                          </div>
                        </div>
                      </Card>
                  ))
              ) : tasks.length === 0 && !isFetchingMore ? (
                  <div className="text-center py-12">
                    <div className="text-slate-400 mb-2">No tasks found</div>
                    <p className="text-slate-500 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
              ) : (
                  <>
                    {tasks.map((task, index) => (
                        <Card
                            key={`${task.id}-${index}`}
                            className="p-4 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                            ref={index === tasks.length - 1 ? lastTaskRef : null}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-semibold text-slate-900">
                              {task.title}
                            </h3>
                            <span className="text-base font-bold text-emerald-600">
                        KES {task.budget.toLocaleString()}
                      </span>
                          </div>

                          <div className="mt-3 space-y-2 text-sm text-slate-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                              <span>
                          {task.location?.city || "Location not specified"}
                                {task.distance && ` (${task.distance.toFixed(1)} km)`}
                        </span>
                            </div>

                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                              <span>{formatTaskDate(task)}</span>
                            </div>

                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-slate-400" />
                              <span>{task.preferred_time || "Anytime"}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center text-sm">
                      <span className="font-medium text-emerald-600">
                        {task.status}
                      </span>
                            <Image
                                src={task.user?.image || "/default-avatar.png"}
                                width={36}
                                height={36}
                                alt={task.user?.name || "User"}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                          </div>
                        </Card>
                    ))}

                    {isFetchingMore && (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Card key={`skeleton-${i}`} className="p-4">
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <Skeleton className="h-6 w-3/4" />
                                  <Skeleton className="h-6 w-16" />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <Skeleton className="h-4 w-4 mr-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                  </div>
                                  <div className="flex items-center">
                                    <Skeleton className="h-4 w-4 mr-2" />
                                    <Skeleton className="h-4 w-1/3" />
                                  </div>
                                  <div className="flex items-center">
                                    <Skeleton className="h-4 w-4 mr-2" />
                                    <Skeleton className="h-4 w-1/4" />
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <Skeleton className="h-4 w-1/3" />
                                  <Skeleton className="h-9 w-9 rounded-full" />
                                </div>
                              </div>
                            </Card>
                        ))
                    )}

                    {!hasMore && tasks.length > 0 && (
                        <div className="text-center py-6 text-slate-500">
                          You&apos;ve reached the end of tasks
                        </div>
                    )}
                  </>
              )}
            </div>

            {/* Map */}
            <div className="hidden lg:block h-[calc(100vh-12rem)] sticky top-24">
              <TaskMap tasks={mapTasks} />
            </div>
          </div>
        </div>
      </div>
  );
}