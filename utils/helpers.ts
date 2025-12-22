
export const calculateProgress = (start: number, end: number | string): number => {
    if (typeof end !== 'number') return 100; // Permanentes se consideran al 100% de vigencia activa
    const currentYear = new Date().getFullYear();
    if (currentYear < start) return 0;
    if (currentYear > end) return 100;
    const totalDuration = end - start;
    if (totalDuration <= 0) return 100;
    const elapsed = currentYear - start;
    return Math.round((elapsed / totalDuration) * 100);
};

export const getSemaforoColor = (progress: number): string => {
    if (progress <= 35) return '#EF4444'; // Rojo (bg-red-500)
    if (progress <= 70) return '#F59E0B'; // Amarillo (bg-amber-500)
    return '#22C55E'; // Verde (bg-green-500)
};

export const getSemaforoClass = (progress: number): string => {
    if (progress <= 35) return 'bg-red-500';
    if (progress <= 70) return 'bg-amber-500';
    return 'bg-green-500';
};
