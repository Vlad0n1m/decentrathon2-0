import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

const Quiz = ({ quiz, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return <div>No quiz questions available.</div>;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleAnswer = (answer) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Quiz completed
            const score = calculateScore();
            onComplete(score, quiz.topicId);
        }
    };

    const calculateScore = () => {
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (answers[index] === answers[question.correctAnswer]) {
                score++;
            }
        });
        return score;
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{quiz.title}</h2>
            <p className="mb-4">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
            <p className="mb-4">{currentQuestion.question}</p>
            {currentQuestion.options.map((option, index) => (
                <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="block w-full mb-2 text-left"
                >
                    {option}
                </Button>
            ))}
        </div>
    );
};

export default Quiz;
