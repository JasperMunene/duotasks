import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function TaskMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        // Provide your Mapbox access token
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        // Initialize a map only once
        mapInstance.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [36.8219, -1.2921],
            zoom: 10,
        });

        // Optional controls
        mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Once the map loads, add custom markers
        mapInstance.current.on('load', () => {
            // Example marker data
            const markers = [
                { coords: [36.8219, -1.2921], title: 'Marker 1' },
                { coords: [36.8319, -1.3000], title: 'Marker 2' },
            ];

            markers.forEach(({ coords, title }) => {
                // Create a HTML element for each custom marker
                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.title = title;
                el.style.width = '35px';
                el.style.height = '45px';
                el.style.backgroundImage = 'url(/map-pin.svg)';
                el.style.backgroundSize = 'contain';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.cursor = 'pointer';

// Anchor to bottom
                new mapboxgl.Marker(el, { anchor: 'bottom' })
                    .setLngLat(coords as [number, number])
                    .addTo(mapInstance.current!);

            });
        });

        // Clean up on unmount
        return () => {
            mapInstance.current?.remove();
        };
    }, []);

    return (
        <div className="w-full h-full rounded-lg bg-slate-100 border border-slate-200">
            <div className="w-full h-full rounded-lg overflow-hidden">
                {/* Map container */}
                <div ref={mapContainer} className="w-full h-full" />
            </div>
        </div>
    );
}
