'use client';

import { useState, useEffect } from 'react';
import { CourseCard } from "@/components/CourseCard"
import { CourseDetails } from "@/components/CourseDetails"
import { useRouter } from 'next/navigation';

export function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      const response = await fetch(`/api/users/${userId}/courses`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user courses');
      }
      const data = await response.json();
      setEnrolledCourses(data.enrolledCourses || []);
      setCreatedCourses(data.createdCourses || []);
    } catch (error) {
      console.error('Error fetching user courses:', error);
      setError(error.message);
      if (error.message.includes('User ID not found')) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseDetails = () => {
    setSelectedCourse(null);
  };

  if (isLoading) {
    return <div>Loading your courses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Мои курсы</h2>
      {enrolledCourses.length === 0 && createdCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl mb-2">У вас пока нет курсов</p>
          <span className="text-6xl" role="img" aria-label="Грустный смайлик">
            😢
          </span>
          <p className="mt-4">Начните обучение прямо сейчас!</p>
        </div>
      ) : (
        <>
          {enrolledCourses.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Курсы, в которых я участвую</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {enrolledCourses.map(course => (
                  <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
                ))}
              </div>
            </div>
          )}
          {createdCourses.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Созданные мной курсы</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {createdCourses.map(course => (
                  <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}
