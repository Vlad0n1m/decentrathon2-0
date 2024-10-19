'use client';

import { useState, useEffect } from 'react';
import { CourseCard } from "@/components/CourseCard"
import { CourseDetails } from "@/components/CourseDetails"
import { useRouter } from 'next/navigation';

export function InterestingCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchInterestingCourses();
  }, []);

  const fetchInterestingCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch interesting courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching interesting courses:', error);
      setError(error.message);
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

  const handleEnroll = async (courseId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to enroll in the course');
      }

      await fetchInterestingCourses();
      setSelectedCourse(null);
      router.push(`/courses/${courseId}`);
    } catch (error) {
      router.push(`/courses/${courseId}`);
      console.error('Error enrolling in course:', error);
      // Здесь можно добавить отображение ошибки пользователю
    }
  };

  if (isLoading) {
    return <div>Loading interesting courses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Интересные курсы</h2>
      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl mb-2">Курсы не найдены</p>
          <span className="text-6xl" role="img" aria-label="Пожимающий плечами человечек">
            🤷
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
          ))}
        </div>
      )}
      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          onClose={handleCloseDetails}
          onEnroll={() => handleEnroll(selectedCourse.id)}
        />
      )}
    </div>
  );
}
