import React from 'react';
import { CALI } from '@/utils/constants';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-br" 
             style={{
                 backgroundImage: `linear-gradient(135deg, ${CALI.MORADO}, ${CALI.TURQUESA})`,
                 color: 'transparent',
                 WebkitBackgroundClip: 'text'
             }}>
            {value}
        </div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</div>
    </div>
);