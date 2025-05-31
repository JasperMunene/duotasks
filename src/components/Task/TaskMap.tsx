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

        // Initialize map only once
        mapInstance.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/jaspermunene/cmbc6pmue002701sd692rdq2q',
            center: [36.8219, -1.2921],
            zoom: 10,
        });

        // Optional controls
        mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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
