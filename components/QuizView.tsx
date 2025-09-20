
import React, { useState } from 'react';
import { Quiz, Question } from '../types';

interface QuizViewProps {
    quiz: Quiz;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleOptionSelect = (questionIndex: number, option: string) => {
        if (showResults) return;
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };

    const calculateScore = () => {
        return quiz.reduce((score, question, index) => {
            return selectedAnswers[index] === question.correctAnswer ? score + 1 : score;
        }, 0);
    };

    const getOptionClass = (questionIndex: number, option: string) => {
        if (!showResults) {
            return selectedAnswers[questionIndex] === option ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600';
        }
        
        const isCorrect = option === quiz[questionIndex].correctAnswer;
        const isSelected = selectedAnswers[questionIndex] === option;

        if (isCorrect) return 'bg-green-600';
        if (isSelected && !isCorrect) return 'bg-red-600';
        return 'bg-gray-700';
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-brand-primary text-center">Test Your Knowledge!</h2>
            {quiz.map((q: Question, qIndex: number) => (
                <div key={qIndex} className="bg-gray-900 p-6 rounded-lg shadow-md">
                    <p className="text-lg font-semibold text-brand-text mb-4">{qIndex + 1}. {q.question}</p>
                    <div className="space-y-3">
                        {q.options.map((option, oIndex) => (
                            <button
                                key={oIndex}
                                onClick={() => handleOptionSelect(qIndex, option)}
                                disabled={showResults}
                                className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${getOptionClass(qIndex, option)}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {showResults && (
                        <div className="mt-4 p-4 rounded-lg bg-gray-800 text-sm">
                            <p className="font-bold text-brand-text">
                                Correct Answer: <span className="text-green-400">{q.correctAnswer}</span>
                            </p>
                            <p className="text-brand-muted mt-2">{q.explanation}</p>
                        </div>
                    )}
                </div>
            ))}

            <div className="text-center mt-8">
                {showResults ? (
                     <div className="text-2xl font-bold p-4 bg-brand-surface rounded-lg">
                        Your Score: <span className="text-brand-primary">{calculateScore()}</span> / {quiz.length}
                    </div>
                ) : (
                    <button
                        onClick={() => setShowResults(true)}
                        className="bg-brand-secondary hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg shadow-lg"
                    >
                        Submit & See Results
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizView;
