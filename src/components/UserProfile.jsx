'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-10">User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              <Image
                src={user.avatarUrl || 'https://via.placeholder.com/150'}
                alt={user.username}
                width={150}
                height={150}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
              <p className="text-white text-opacity-90">Joined on {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="text-2xl mr-4">🏆</span>
              <span className="text-gray-700">
                <strong>EXP:</strong> {user.exp}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-4">🔥</span>
              <span className="text-gray-700">
                <strong>Streak:</strong> {user.streakDays} days
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-4">📚</span>
              <span className="text-gray-700">
                <strong>Courses Enrolled:</strong> {user.enrolledCourses.length}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-4">🎓</span>
              <span className="text-gray-700">
                <strong>Courses Created:</strong> 1
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
