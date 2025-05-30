'use client';

import { useEffect } from 'react';

export default function TaskMap() {
    useEffect(() => {
        // Initialize map here when we add the mapping library
    }, []);

    return (
        <div className="w-full h-full rounded-lg bg-slate-100 border border-slate-200">
            <div className="w-full h-full rounded-lg overflow-hidden">
                {/* Map will be initialized here */}
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Map view will be implemented here
                </div>
            </div>
        </div>
    );
}