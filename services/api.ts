import { DocumentRecord, PlanningInstrument } from '@/types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'cali500_admin_token';

const REQUIRED_PLANNING_FIELDS: Array<keyof PlanningInstrument> = [
  'nombre',
  'tipo',
  'eje',
  'fecha_inicio',
  'fecha_fin',
  'estado',
  'link',
  'enlace_web'
];

const normalizeText = (value: unknown) => String(value ?? '').trim();

const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  Object.entries(authHeaders()).forEach(([key, value]) => headers.set(key, value));

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'error' in payload
      ? String((payload as { error: unknown }).error)
      : 'No se pudo completar la solicitud.';
    throw new Error(message);
  }

  return payload as T;
};

export const getPlanningInstrumentValidationErrors = (instrumento: Partial<PlanningInstrument>) => {
  const errors: string[] = [];
  REQUIRED_PLANNING_FIELDS.forEach((field) => {
    if (!normalizeText(instrumento[field])) errors.push(`El campo ${field.replace('_', ' ')} es obligatorio.`);
  });

  const hiddenStates = ['borrador', 'oculto', 'inactivo', 'archivado', 'vencido'];
  if (hiddenStates.includes(normalizeText(instrumento.estado).toLowerCase())) {
    errors.push('El estado actual no es valido para publicacion.');
  }

  return errors;
};

export const checkBackendHealth = async () => {
  try {
    const result = await request<{ status: string }>('/api/health');
    return result.status === 'online';
  } catch {
    return false;
  }
};

export const getDocuments = async () => {
  try {
    const result = await request<{ data: DocumentRecord[] }>('/api/documents');
    return { data: result.data, error: null };
  } catch (error: any) {
    return { data: [] as DocumentRecord[], error: error.message ?? 'No se pudo cargar la informacion.' };
  }
};

export const saveDocument = async (_documento: Partial<DocumentRecord>) => {
  return { success: false, error: 'La edicion documental directa esta deshabilitada. Use Planeacion LP en el admin.' };
};

export const deleteDocument = async (_documento: DocumentRecord) => {
  return { success: false, error: 'La eliminacion documental directa esta deshabilitada. Use Planeacion LP en el admin.' };
};

export const uploadDocumentFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request<{ path: string; publicUrl: string; fileName: string }>('/api/uploads', {
    method: 'POST',
    body: formData
  });
};

export const getFileDownloadUrl = (documento: DocumentRecord) => documento.archivo_url ?? '';

export const signInAdmin = async (email: string, password: string) => {
  try {
    const result = await request<{ token: string; user: { id: number; email: string; nombre: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
    return { success: true, data: result.user };
  } catch (error: any) {
    return { success: false, error: error.message ?? 'No se pudo iniciar sesion.' };
  }
};

export const signOutAdmin = async () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getAdminSession = async () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) return null;

  try {
    const result = await request<{ user: { userId: number; email: string; nombre: string } }>('/api/auth/session');
    return result.user;
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
};

export const getAllPlanningInstruments = async () => {
  try {
    const result = await request<{ data: PlanningInstrument[] }>('/api/planning-instruments');
    return { data: result.data, error: null };
  } catch (error: any) {
    return { data: [] as PlanningInstrument[], error: error.message ?? 'No se pudo cargar la informacion.' };
  }
};

export const savePlanningInstrument = async (instrumento: Partial<PlanningInstrument>) => {
  try {
    const isNew = !instrumento.id || instrumento.id === 'nuevo';
    const result = await request<{ data: PlanningInstrument }>(
      isNew ? '/api/planning-instruments' : `/api/planning-instruments/${instrumento.id}`,
      {
        method: isNew ? 'POST' : 'PUT',
        body: JSON.stringify(instrumento)
      }
    );
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, error: error.message ?? 'No se pudo guardar el instrumento.' };
  }
};

export const deletePlanningInstrument = async (instrumento: PlanningInstrument) => {
  try {
    await request<{ success: boolean }>(`/api/planning-instruments/${instrumento.id}`, { method: 'DELETE' });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message ?? 'No se pudo eliminar el instrumento.' };
  }
};

export const getInstruments = getDocuments;
export const saveInstrument = saveDocument;
