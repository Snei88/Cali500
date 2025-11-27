import React from 'react';
import { CALI } from '@/utils/constants';

interface AnalysisBoxProps {
    type: 'critico' | 'oportunidad' | 'alerta' | 'info';
    title: string;
    items: string[];
}

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ type, title, items }) => {
    const styles = {
        critico: { border: CALI.ROSA, bg: '#fff5f7' },
        oportunidad: { border: CALI.VERDE, bg: '#f5fff5' },
        alerta: { border: CALI.AMARILLO, bg: '#fffef5' },
        info: { border: CALI.TURQUESA, bg: '#f0fdf4' }
    };
    const style = styles[type] || styles.info;
    
    return (
        <div className="p-4 rounded-md border-l-4 bg-slate-50" style={{ borderLeftColor: style.border, backgroundColor: style.bg }}>
            <h4 className="text-sm font-bold mb-3" style={{ color: CALI.MORADO }}>{title}</h4>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-700 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};