import { useRef, useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    position: {
        lat: number;
        lng: number;
    };
}

interface TaskMapProps {
    tasks: Task[];
}

export default function TaskMap({ tasks }: TaskMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (!mapContainer.current) return;

        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps) {
            initMap();
            return;
        }

        // Load Google Maps API if not already loaded
        if (!document.querySelector('#google-maps-script')) {
            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            window.initMap = initMap;
        }

        return () => {
            if (mapInstance.current) {
                // Clean up map instance
                mapInstance.current = null;
            }
        };
    }, []);

    const initMap = () => {
        if (!mapContainer.current) return;

        // Initialize the map
        mapInstance.current = new window.google.maps.Map(mapContainer.current, {
            center: { lat: -1.2921, lng: 36.8219 },
            zoom: 10,
            mapId: '',
            disableDefaultUI: true,
            styles: [
                {
                    featureType: "poi",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "transit",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });

        setMapLoaded(true);
    };

    useEffect(() => {
        if (!mapInstance.current || !mapLoaded) return;

        // Add markers for each task
        tasks.forEach((task) => {
            new window.google.maps.Marker({
                position: task.position,
                map: mapInstance.current,
                title: task.title,
                icon: {
                    url: '/map-pin.svg',
                    scaledSize: new window.google.maps.Size(35, 45),
                    anchor: new window.google.maps.Point(17, 45)
                }
            });
        });

        // Adjust view to show all markers
        if (tasks.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            tasks.forEach(task => bounds.extend(task.position));
            mapInstance.current.fitBounds(bounds);

            // Prevent excessive zoom for single markers
            if (tasks.length === 1) {
                mapInstance.current.setZoom(14);
            }
        } else {
            // Default view if no tasks
            mapInstance.current.setCenter({ lat: -1.2921, lng: 36.8219 });
            mapInstance.current.setZoom(10);
        }
    }, [tasks, mapLoaded]);

    return (
        <div className="w-full h-full rounded-lg bg-slate-100 border border-slate-200">
            <div className="w-full h-full rounded-lg overflow-hidden">
                {/* Map container */}
                <div
                    ref={mapContainer}
                    className="w-full h-full"
                    style={{ minHeight: '300px' }}
                />

                {/* Loading state */}
                {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <p>Loading map...</p>
                    </div>
                )}
            </div>
        </div>
    );
}