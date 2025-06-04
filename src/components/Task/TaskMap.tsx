import { useRef, useEffect, useState } from 'react';


export default function TaskMap() {
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
            center: { lat: 1.2921, lng: 36.8219 },
            zoom: 10,
            mapId: '923c89c476068ebefa09a522',
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

        // Add custom markers
        const markers = [
            { position: { lat: -1.2921, lng: 36.8219 }, title: 'Marker 1' },
            { position: { lat: -1.3000, lng: 36.8319 }, title: 'Marker 2' },
        ];

        markers.forEach(({ position, title }) => {
            new window.google.maps.Marker({
                position,
                map: mapInstance.current,
                title,
                icon: {
                    url: '/map-pin.svg',
                    scaledSize: new window.google.maps.Size(35, 45),
                    anchor: new window.google.maps.Point(17, 45)
                }
            });
        });

        setMapLoaded(true);
    };

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