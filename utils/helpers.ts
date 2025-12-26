
export const calculateProgress = (start: number, end: number | string): number => {
    if (end === 'Permanente') return 100;
    const endNum = Number(end);
    if (isNaN(endNum)) return 100;
    
    const currentYear = new Date().getFullYear();
    if (currentYear < start) return 0;
    if (currentYear >= endNum) return 100;
    
    const totalDuration = endNum - start;
    if (totalDuration <= 0) return 100;
    const elapsed = currentYear - start;
    return Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
};

export type SemaforoStatus = 'critico' | 'intermedio' | 'optimo';

export const getSemaforoStatus = (progress: number): SemaforoStatus => {
    if (progress <= 35) return 'critico';
    if (progress <= 70) return 'intermedio';
    return 'optimo';
};

export const getSemaforoColor = (status: SemaforoStatus): string => {
    switch (status) {
        case 'critico': return '#EF4444'; // Rojo (bg-red-500)
        case 'intermedio': return '#F59E0B'; // Amarillo (bg-amber-500)
        case 'optimo': return '#22C55E'; // Verde (bg-green-500)
    }
};

export const getSemaforoClass = (status: SemaforoStatus): string => {
    switch (status) {
        case 'critico': return 'bg-red-500';
        case 'intermedio': return 'bg-amber-500';
        case 'optimo': return 'bg-green-500';
    }
};
