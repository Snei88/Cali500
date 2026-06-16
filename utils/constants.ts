import { DocumentCategory, DocumentStatus } from '@/types';

export const VISION_IMAGE_URL = 'assets/nuevo_logo.png';

export const CALI = {
  ORANGE: '#F46217',
  MAGENTA: '#F52789',
  INDIGO: '#3A0D7B',
  NAVY: '#3A0D7B',
  BLUE: '#3A0D7B',
  CYAN: '#00A7C8',
  GREEN: '#17A773',
  LIME: '#8BC53F',
  GOLD: '#F2B705',
  ROSE: '#D9487D',
  INK: '#102033',
  MUTED: '#64748B',
  SURFACE: '#F6F8FB',
  MORADO: '#3A0D7B',
  TURQUESA: '#00C9B7',
  VERDE: '#8BC53F',
  AMARILLO: '#FFD93D',
  ROSA: '#F52789',
  GRIS_MEDIO: '#9E9E9E'
};

export const COLORS = [CALI.INDIGO, CALI.MAGENTA, CALI.ORANGE, CALI.CYAN, CALI.GREEN, CALI.GOLD];

export const CATEGORY_ORDER: DocumentCategory[] = [
  'Instrumentos Macro',
  'Normativo',
  'Documento Estratégico',
  'Política Pública',
  'Plan',
  'Plan Maestro',
  'Plan de Ordenamiento',
  'Otro'
];

export const STATUS_ORDER: DocumentStatus[] = [
  'En Ejecución',
  'Permanente',
  'En Ejecución - Observatorio',
  'En Ejecución - Mesa de Asistencia Técnica',
  'En Ejecución - Informes',
  'En Ejecución - Informe',
  'En Ejecución - Mesa',
  'En Actualización',
  'En Actualización - Observatorio',
  'En Actualización - Expediente Municipal',
  'En Actualización - GAMAU',
  'Finalizada - Observatorio',
  'Archivado',
  'Vencido'
];

export const STATUS_COLORS: Record<string, string> = {
  Vigente: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Publicado: 'bg-blue-50 text-blue-700 border-blue-200',
  Permanente: 'bg-blue-50 text-blue-700 border-blue-200',
  'En Ejecución': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'En Ejecución - Observatorio': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'En Ejecución - Mesa de Asistencia Técnica': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'En Ejecución - Informes': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'En Ejecución - Informe': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'En Ejecución - Mesa': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'En Actualización': 'bg-amber-50 text-amber-700 border-amber-200',
  'En Actualización - Observatorio': 'bg-amber-50 text-amber-700 border-amber-200',
  'En Actualización - Expediente Municipal': 'bg-amber-50 text-amber-700 border-amber-200',
  'En Actualización - GAMAU': 'bg-amber-50 text-amber-700 border-amber-200',
  'Finalizada - Observatorio': 'bg-slate-100 text-slate-600 border-slate-200',
  'En revision': 'bg-amber-50 text-amber-700 border-amber-200',
  Archivado: 'bg-slate-100 text-slate-600 border-slate-200',
  Vencido: 'bg-rose-50 text-rose-700 border-rose-200'
};

export const STATUS_BORDER_COLORS: Record<string, string> = {
  Vigente: 'border-l-emerald-500',
  Publicado: 'border-l-blue-500',
  Permanente: 'border-l-blue-500',
  'En Ejecución': 'border-l-emerald-500',
  'En Ejecución - Observatorio': 'border-l-emerald-500',
  'En Ejecución - Mesa de Asistencia Técnica': 'border-l-cyan-500',
  'En Ejecución - Informes': 'border-l-cyan-500',
  'En Ejecución - Informe': 'border-l-cyan-500',
  'En Ejecución - Mesa': 'border-l-cyan-500',
  'En Actualización': 'border-l-amber-500',
  'En Actualización - Observatorio': 'border-l-amber-500',
  'En Actualización - Expediente Municipal': 'border-l-amber-500',
  'En Actualización - GAMAU': 'border-l-amber-500',
  'Finalizada - Observatorio': 'border-l-slate-400',
  'En revision': 'border-l-amber-500',
  Archivado: 'border-l-slate-400',
  Vencido: 'border-l-rose-500'
};

export const HERO_IMAGES = {
  government: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85',
  documents: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85',
  youth: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85',
  technology: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=85'
};

export const SUPABASE_TABLE = 'documentos';
export const SUPABASE_BUCKET = 'documentos';
export const PLANNING_TABLE = 'instrumentos_planeacion';

export const AXIS_ORDER = CATEGORY_ORDER;
