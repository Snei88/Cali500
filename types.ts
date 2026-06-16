export type UserRole = 'usuario' | 'administrador';

export type DocumentCategory = string;

export type DocumentStatus = string;

export interface DocumentRecord {
  id: number | string;
  nombre: string;
  vigencia: string;
  categoria: DocumentCategory;
  fecha: string;
  estado: DocumentStatus;
  entidad: string;
  descripcion?: string;
  archivo_path?: string;
  archivo_url?: string;
  archivo_nombre?: string;
  metadatos?: Record<string, unknown>;
  publico: boolean;
  created_at?: string;
  updated_at?: string;
}

export type Instrumento = DocumentRecord;

export interface PlanningInstrument {
  id?: number | string;
  nombre: string;
  tipo: string;
  eje: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  link: string;
  enlace_web: string;
  documento_url?: string;
  observatorio?: string;
  visible: boolean;
  validacion_errores?: string[];
  origen?: string;
  source_row?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Stats {
  total: number;
  publicos: number;
  privados: number;
  vigentes: number;
  enRevision: number;
  publicados: number;
  cobertura: string;
  byCategory: { name: string; value: number }[];
  byEntity: { name: string; count: number }[];
  byMonth: { name: string; documentos: number }[];
  estadosMap: Record<string, number>;
  activity: { label: string; value: string; tone: 'success' | 'warning' | 'info' }[];
}
