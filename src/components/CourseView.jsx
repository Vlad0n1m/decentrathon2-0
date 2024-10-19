import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function CourseView({ courseId }) {
  const [course, setCourse] = useState(null);
  const [currentSubtopic, setCurrentSubtopic] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data);
    };
    fetchCourse();
  }, [courseId]);

  if (!course) return <div>Загрузка...</div>;

  const handleNextSubtopic = () => {
    if (currentSubtopic < course.subtopics.length - 1) {
      setCurrentSubtopic(currentSubtopic + 1);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">{course.subtopics[currentSubtopic].title}</h2>
        <p>{course.subtopics[currentSubtopic].content}</p>
      </Card>
      <Button onClick={handleNextSubtopic} disabled={currentSubtopic === course.subtopics.length - 1}>
        Следующая тема
      </Button>
    </div>
  );
}
