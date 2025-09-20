
export enum AppMode {
    EXPLAINER = 'EXPLAINER',
    QUIZ = 'QUIZ',
}

export interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export type Quiz = Question[];
