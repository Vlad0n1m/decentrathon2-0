'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown, CheckCircle, Circle, BookOpen } from 'lucide-react';
import { addBackgroundTask } from '@/lib/backgroundService';
import ErrorBoundary from '@/components/ErrorBoundary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Quiz from '@/components/Quiz';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import toast, { Toaster } from 'react-hot-toast';

export default function CoursePage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loadingTopics, setLoadingTopics] = useState({});
    const [error, setError] = useState(null);
    const [quizzes, setQuizzes] = useState({});
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [completedQuizzes, setCompletedQuizzes] = useState({});

    useEffect(() => {
        console.log('CoursePage mounted, fetching course with id:', id);
        fetchCourse();
        const storedCompletedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
        setCompletedQuizzes(storedCompletedQuizzes);
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await fetch(`/api/courses/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch course');
            }
            const data = await response.json();
            console.log('Course data fetched:', data);
            // Sort topics by their order
            data.topics.sort((a, b) => a.order - b.order);
            setCourse(data);
            initializeTopicContent(data.topics, data.id);
            // Initialize quizzes state
            const initialQuizzes = {};
            data.topics.forEach(topic => {
                if (topic.quiz) {
                    initialQuizzes[topic.id] = topic.quiz;
                }
            });
            setQuizzes(initialQuizzes);
        } catch (error) {
            console.error('Error fetching course:', error);
            setError(error.message);
        }
    };

    const initializeTopicContent = (topics, courseId) => {
        const newLoadingTopics = {};
        topics.forEach(topic => {
            if (topic.status === 'PENDING') {
                addBackgroundTask(courseId, topic.id);
                newLoadingTopics[topic.id] = true;
            }
        });
        setLoadingTopics(newLoadingTopics);
    };

    const handleStartQuiz = async (topicId) => {
        if (completedQuizzes[topicId]) {
            toast.error("You've already completed this quiz!");
            return;
        }

        if (quizzes[topicId]) {
            try {
                const response = await fetch(`/api/quizzes/${quizzes[topicId].id}`);
                if (response.ok) {
                    const quizData = await response.json();
                    console.log('Quiz data fetched:', quizData);
                    setCurrentQuiz({...quizData, topicId});
                    setIsQuizModalOpen(true);
                } else {
                    throw new Error('Failed to fetch quiz data');
                }
            } catch (error) {
                console.error('Error fetching quiz:', error);
                toast.error('Failed to load quiz. Please try again.');
            }
        } else {
            try {
                const response = await fetch('/api/generate-quiz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topicId }),
                });
                if (response.ok) {
                    const quiz = await response.json();
                    setQuizzes(prev => ({ ...prev, [topicId]: quiz }));
                    setCurrentQuiz({...quiz, topicId});
                    setIsQuizModalOpen(true);
                } else {
                    throw new Error('Failed to generate quiz');
                }
            } catch (error) {
                console.error('Error starting quiz:', error);
                toast.error('Failed to generate quiz. Please try again.');
            }
        }
    };

    const handleQuizComplete = async (score, topicId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return;
        }
        try {
            const expGained = score * 10; // 10 EXP per correct answer
            const response = await fetch('/api/update-exp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, exp: expGained }),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(`Congratulations! You earned ${expGained} EXP!`);
                const updatedCompletedQuizzes = { 
                    ...completedQuizzes, 
                    [course.id]: { 
                        ...completedQuizzes[course.id],
                        [topicId]: true 
                    } 
                };
                setCompletedQuizzes(updatedCompletedQuizzes);
                localStorage.setItem('completedQuizzes', JSON.stringify(updatedCompletedQuizzes));
            } else {
                throw new Error('Failed to update EXP');
            }
        } catch (error) {
            console.error('Error updating EXP:', error);
            toast.error('Failed to update EXP. Please try again.');
        }
        setCurrentQuiz(null);
        setIsQuizModalOpen(false);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!course) {
        return <div>Loading course...</div>;
    }

    return (
        <ErrorBoundary>
            <Toaster />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
                <Accordion type="single" collapsible className="w-full">
                    {course.topics.map((topic) => (
                        <AccordionItem key={topic.id} value={topic.id}>
                            <AccordionTrigger className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {topic.status === 'COMPLETED' ? (
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-gray-300 mr-2" />
                                    )}
                                    <span>{topic.title}</span>
                                </div>
                                {quizzes[topic.id] && <BookOpen className="h-4 w-4 text-blue-500 ml-2" />}
                            </AccordionTrigger>
                            <AccordionContent>
                                {loadingTopics[topic.id] ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">Generating content...</span>
                                    </div>
                                ) : (
                                    <>
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            className="markdown-content"
                                        >
                                            {topic.content || 'Content is not available yet.'}
                                        </ReactMarkdown>
                                        {topic.content && (
                                            <Button 
                                                onClick={() => handleStartQuiz(topic.id)}
                                                className="mt-4"
                                                disabled={completedQuizzes[topic.id]}
                                            >
                                                {completedQuizzes[topic.id] 
                                                    ? 'Quiz Completed' 
                                                    : quizzes[topic.id] 
                                                        ? 'Start Quiz' 
                                                        : 'Generate Quiz'}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quiz</DialogTitle>
                    </DialogHeader>
                    {currentQuiz && (
                        <Quiz quiz={currentQuiz} onComplete={handleQuizComplete} />
                    )}
                </DialogContent>
            </Dialog>
        </ErrorBoundary>
    );
}
