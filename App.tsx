
import React, { useState, useCallback } from 'react';
import { AppMode, Quiz } from './types';
import { extractTextFromPDF } from './services/pdfService';
import { explainConcept, generateQuiz } from './services/geminiService';
import Header from './components/Header';
import Tabs from './components/Tabs';
import FileUpload from './components/FileUpload';
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';
import QuizView from './components/QuizView';

const App: React.FC = () => {
    const [mode, setMode] = useState<AppMode>(AppMode.EXPLAINER);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (newFile: File | null) => {
        setFile(newFile);
        setExplanation(null);
        setQuiz(null);
        setError(null);
    };

    const handleSubmit = useCallback(async () => {
        if (!file) {
            setError("Please upload a PDF file first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setExplanation(null);
        setQuiz(null);

        try {
            const text = await extractTextFromPDF(file);
            if (text.trim().length === 0) {
                setError("Could not extract text from the PDF. The file might be empty or image-based.");
                setIsLoading(false);
                return;
            }

            if (mode === AppMode.EXPLAINER) {
                const result = await explainConcept(text);
                setExplanation(result);
            } else {
                const result = await generateQuiz(text);
                setQuiz(result);
            }
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`An error occurred while processing your request: ${errorMessage}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    }, [file, mode]);

    return (
        <div className="min-h-screen bg-brand-background font-sans">
            <Header />
            <main className="container mx-auto max-w-4xl p-4 md:p-8">
                <div className="bg-brand-surface rounded-xl shadow-2xl p-6 md:p-8">
                    <Tabs activeMode={mode} onModeChange={setMode} />
                    
                    <div className="mt-8">
                        <FileUpload onFileChange={handleFileChange} />
                        <button
                            onClick={handleSubmit}
                            disabled={!file || isLoading}
                            className="w-full mt-6 bg-brand-primary hover:bg-sky-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center text-lg shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner />
                                    Processing...
                                </>
                            ) : (
                                `Generate ${mode === AppMode.EXPLAINER ? 'Explanation' : 'Quiz'}`
                            )}
                        </button>

                        {error && <ErrorMessage message={error} />}

                        <div className="mt-8 min-h-[200px]">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center text-brand-muted">
                                    <Spinner />
                                    <p className="mt-2 text-lg">AI is thinking... please wait.</p>
                                </div>
                            )}
                            
                            {explanation && mode === AppMode.EXPLAINER && (
                                <div className="prose prose-invert max-w-none p-6 bg-gray-900 rounded-lg">
                                    <h2 className="text-2xl font-bold text-brand-primary mb-4">Concept Explanation</h2>
                                    <p className="whitespace-pre-wrap">{explanation}</p>
                                </div>
                            )}

                            {quiz && mode === AppMode.QUIZ && <QuizView quiz={quiz} />}
                        </div>
                    </div>
                </div>
                 <footer className="text-center text-brand-muted mt-8 text-sm">
                    <p>Powered by Gemini AI</p>
                </footer>
            </main>
        </div>
    );
};

export default App;
