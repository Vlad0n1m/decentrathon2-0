'use client';

import { useState, useEffect } from 'react';
import { Onboarding } from '@/components/Onboarding';
import { CreateCourse } from '@/components/CreateCourse';
import { MyCourses } from '@/components/MyCourses';
import { InterestingCourses } from '@/components/InterestingCourses';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    if (storedUsername && storedUserId) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setUserId(storedUserId);
    }
  }, []);

  const handleAuthComplete = (username, id) => {
    setIsAuthenticated(true);
    setUsername(username);
    setUserId(id);
  };

  if (!isAuthenticated) {
    return <Onboarding onComplete={handleAuthComplete} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Привет, {username}!</h1>
      <CreateCourse userId={userId} />
      <div className="mt-8">
        <MyCourses userId={userId} />
      </div>
      <div className="mt-8">
        <InterestingCourses />
      </div>
    </div>
  );
}
