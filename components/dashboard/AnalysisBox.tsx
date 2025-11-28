
import React from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { CALI } from '@/utils/constants';

interface AnalysisBoxProps {
    type: 'critico' | 'oportunidad' | 'alerta' | 'info';
    title: string;
    items: string[];
}

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ type, title, items }) => {
    const config = {
        critico: { 
            border: CALI.ROSA, 
            bg: '#fff5f7',
            icon: AlertTriangle,
            iconColor: '#be185d' // Pink-700
        },
        oportunidad: { 
            border: CALI.VERDE, 
            bg: '#f5fff5',
            icon: CheckCircle2,
            iconColor: '#15803d' // Green-700
        },
        alerta: { 
            border: CALI.AMARILLO, 
            bg: '#fffef5',
            icon: AlertCircle,
            iconColor: '#b45309' // Amber-700
        },
        info: { 
            border: CALI.TURQUESA, 
            bg: '#f0fdf4',
            icon: Info,
            iconColor: '#0f766e' // Teal-700
        }
    };
    
    const style = config[type] || config.info;
    const Icon = style.icon;
    
    return (
        <div className="p-4 rounded-md border-l-4 bg-slate-50" style={{ borderLeftColor: style.border, backgroundColor: style.bg }}>
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: CALI.MORADO }}>
                <Icon className="h-4 w-4" style={{ color: style.iconColor }} />
                {title}
            </h4>
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
