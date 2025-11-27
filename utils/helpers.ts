export const calculateProgress = (start: number, end: number | string): number => {
    if (typeof end !== 'number') return 0;
    const currentYear = new Date().getFullYear();
    if (currentYear < start) return 0;
    if (currentYear > end) return 100;
    const totalDuration = end - start;
    if (totalDuration <= 0) return 100;
    const elapsed = currentYear - start;
    return Math.round((elapsed / totalDuration) * 100);
};