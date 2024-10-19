'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';
import { CourseTopicsModal } from './CourseTopicsModal';
import { useRouter } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea"

export function CreateCourse() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the user ID from localStorage or your authentication system
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const generateCoursePlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-course-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedTopics(data);
        setIsModalOpen(true);
      } else {
        throw new Error('Failed to generate course plan');
      }
    } catch (error) {
      console.error('Error generating course plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateCoursePlan();
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const duration = level === 'easy' ? '1 день' : level === 'medium' ? '1-3 дня' : '7-14 дней';
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: topic,
          level,
          category,
          description,
          duration,
          topics: {
            create: generatedTopics.map((topicTitle, index) => ({
              title: topicTitle,
              content: '',
              status: 'PENDING',
              order: index + 1
            }))
          },
          author: { connect: { id: userId } },
        }),
      });
      if (response.ok) {
        const course = await response.json();
        router.push(`/courses/${course.id}`);
      } else {
        throw new Error('Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Что вы хотите изучить?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <Select onValueChange={setLevel} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите уровень погружения" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Поверхностно (1 день)</SelectItem>
            <SelectItem value="medium">Среднее (1-3 дня)</SelectItem>
            <SelectItem value="hard">Полное (7-14 дней)</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setCategory} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Programming">Программирование</SelectItem>
            <SelectItem value="Language">Языки</SelectItem>
            <SelectItem value="Science">Наука</SelectItem>
            <SelectItem value="Art">Искусство</SelectItem>
            <SelectItem value="Other">Другое</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Описание курса"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Генерация курса...
            </>
          ) : (
            'Создать курс'
          )}
        </Button>
      </form>
      <CourseTopicsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topics={generatedTopics}
        onConfirm={handleConfirm}
        onRegenerate={generateCoursePlan}
      />
    </>
  );
}
