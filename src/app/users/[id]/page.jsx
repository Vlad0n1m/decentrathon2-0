'use client';

import { UserProfile } from '@/components/UserProfile';
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
    const { id } = useParams();
    return <UserProfile userId={id} />;
}