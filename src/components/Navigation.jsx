'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Settings } from 'lucide-react';

const navItems = [
    { href: '/', icon: Home, label: 'Главная' },
    { href: '/leaderboard', icon: BookOpen, label: 'Таблица лидеров' },
    { href: '/settings', icon: Settings, label: 'Настройки' },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
            <div className="flex justify-around">
                {navItems.map(({ href, icon: Icon, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center p-2 ${
                            pathname === href 
                                ? 'text-primary' 
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Icon size={24} />
                        <span className="text-xs mt-1">{label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
