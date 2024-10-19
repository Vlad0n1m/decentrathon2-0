'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { UserProfile } from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
export default function SettingsPage() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Настройки</h1>
            {userId && <UserProfile userId={userId} />}
            <div className="flex justify-center">
                <ThemeToggle />
            </div>
        </div>
    );
}
