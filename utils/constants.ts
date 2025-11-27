import { EjeEstrategico, TipoInstrumento, EstadoInstrumento } from '@/types';

export const AXIS_ORDER: EjeEstrategico[] = [
    'Bienestar Basado en la Interculturalidad',
    'Territorio Adaptativo e Inteligente',
    'Competitividad Sostenible',
    'Transversal'
];

export const TYPES_ORDER: TipoInstrumento[] = [
    'Política Pública', 'Plan', 'Instrumentos Macro', 'Documento Estratégico', 'Plan Maestro', 'Normativo', 'Plan de Ordenamiento'
];

export const STATUS_ORDER: EstadoInstrumento[] = [
    'En Ejecución', 'En Actualización', 'En proyecto', 'Permanente', 'Finalizada'
];

export const VISION_IMAGE_URL = "https://page.gensparksite.com/v1/base64_upload/541d3fc08c32ac0f13337a65ac9f8875";

export const CALI = {
    MORADO: '#52227C',
    TURQUESA: '#00C9B7',
    VERDE: '#8BC53F',
    AMARILLO: '#FFD93D',
    ROSA: '#FF6B9D',
    GRIS_MEDIO: '#9E9E9E'
};

export const COLORS = [CALI.MORADO, CALI.TURQUESA, CALI.VERDE, CALI.AMARILLO, CALI.ROSA, '#9C27B0', '#E91E63'];

export const STATUS_COLORS: Record<string, string> = {
    'En Ejecución': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'En Actualización': 'bg-amber-100 text-amber-700 border-amber-200',
    'Permanente': 'bg-blue-100 text-blue-700 border-blue-200',
    'En proyecto': 'bg-violet-100 text-violet-700 border-violet-200',
    'Finalizada': 'bg-slate-100 text-slate-700 border-slate-200',
    'Finalizado': 'bg-slate-100 text-slate-700 border-slate-200'
};

export const STATUS_BORDER_COLORS: Record<string, string> = {
    'En Ejecución': 'border-l-emerald-500',
    'En Actualización': 'border-l-amber-500',
    'Permanente': 'border-l-blue-500',
    'En proyecto': 'border-l-violet-500',
    'Finalizada': 'border-l-slate-500',
    'Finalizado': 'border-l-slate-500'
};