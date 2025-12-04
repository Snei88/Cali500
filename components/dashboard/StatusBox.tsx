import React from 'react';

interface StatusBoxProps {
    label: string;
    count: number;
    colorCode: string;
    bgGradient: string;
}

export const StatusBox: React.FC<StatusBoxProps> = ({ label, count, colorCode, bgGradient }) => (
    <div className="rounded-lg p-4 flex flex-col items-center justify-center border-2 transition-all hover:-translate-y-1 hover:shadow-lg h-full" 
         style={{ borderColor: colorCode, background: bgGradient }}>
        <span className="text-3xl font-bold leading-none mb-2" style={{ color: colorCode }}>{count}</span>
        <span className="text-[10px] font-bold uppercase text-center tracking-wide" 
              style={{ color: colorCode, filter: 'brightness(0.8)' }}>
            {label}
        </span>
    </div>
);