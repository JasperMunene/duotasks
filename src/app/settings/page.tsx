'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
    useEffect(() => {
        redirect('/settings/phone');
    }, []);

    return null;
}