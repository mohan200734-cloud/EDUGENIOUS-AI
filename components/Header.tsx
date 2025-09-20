
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-brand-surface/50 backdrop-blur-sm p-4 sticky top-0 z-10 border-b border-gray-700">
            <div className="container mx-auto max-w-4xl flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.002 1.842l7 3.5a1 1 0 00.786 0l7-3.5a1 1 0 00.002-1.842l-7-3.5zM3 9.42l7 3.5 7-3.5-7-3.5-7 3.5z" />
                    <path d="M1 11.542l7 3.5a1 1 0 00.786 0l7-3.5a1 1 0 00.002-1.842l-7-3.5a1 1 0 00-.788 0l-7 3.5a1 1 0 00.002 1.842z" />
                </svg>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    EduGenius <span className="text-brand-primary">AI</span>
                </h1>
            </div>
        </header>
    );
};

export default Header;
