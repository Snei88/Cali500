
export type EjeEstrategico = 
  | 'Bienestar Basado en la Interculturalidad'
  | 'Territorio Adaptativo e Inteligente'
  | 'Competitividad Sostenible'
  | 'Transversal';

export type TipoInstrumento = 
  | 'Política Pública'
  | 'Plan'
  | 'Instrumentos Macro'
  | 'Documento Estratégico'
  | 'Plan Maestro'
  | 'Normativo'
  | 'Plan de Ordenamiento';

export type EstadoInstrumento = 
  | 'En Ejecución'
  | 'En Actualización'
  | 'Permanente'
  | 'Finalizada'
  | 'En proyecto';

export interface Instrumento {
    id: number;
    nombre: string;
    tipo: TipoInstrumento;
    eje: EjeEstrategico;
    inicio: number;
    fin: number | 'Permanente';
    temporalidad: string | number;
    estado: EstadoInstrumento;
    seguimiento: 'Si' | 'No';
    observatorio: string; // Empty string if none
    enlace?: string;
    pdf_informe?: string;
    description?: string; // Simulated backend field
    
    // Campos para carga de archivo local - Documento Maestro
    archivo_nombre?: string;
    archivo_base64?: string;
    archivo_tipo?: string;

    // Campos para carga de archivo local - Análisis
    archivo_analisis_nombre?: string;
    archivo_analisis_base64?: string;
    archivo_analisis_tipo?: string;

    // Campos para carga de archivo local - Política Pública / Ley
    archivo_ley_nombre?: string;
    archivo_ley_base64?: string;
    archivo_ley_tipo?: string;
}

export interface Stats {
    total: number;
    conSeguimiento: number;
    sinSeguimiento: number;
    cobertura: string;
    byType: { name: string; value: number }[];
    byEje: { name: string; shortName: string; count: number }[];
    estadosMap: Record<string, number>;
}
