
import React from 'react';
import { AppMode } from '../types';

interface TabsProps {
    activeMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeMode, onModeChange }) => {
    const tabs = [
        { mode: AppMode.EXPLAINER, label: 'Concept Explainer' },
        { mode: AppMode.QUIZ, label: 'Quiz Generator' },
    ];

    return (
        <div className="flex justify-center bg-gray-900 p-1 rounded-lg">
            {tabs.map((tab) => (
                <button
                    key={tab.mode}
                    onClick={() => onModeChange(tab.mode)}
                    className={`w-full text-center px-4 py-2.5 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                        activeMode === tab.mode
                            ? 'bg-brand-primary text-white shadow'
                            : 'text-brand-muted hover:bg-brand-surface'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
