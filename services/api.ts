
// Configuración de la API Profesional

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL Dinámica
let API_URL = isLocal 
    ? 'http://localhost:8080/api' 
    : 'https://vision-cali-backend.onrender.com/api';

if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);

console.log(`🚀 [API] Conectando a: ${API_URL}`);

// --- HEALTH CHECK ---
export const checkBackendHealth = async (): Promise<boolean> => {
    if (!API_URL) return false;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), isLocal ? 3000 : 15000);
        const response = await fetch(`${API_URL}/health`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) return false;
        const data = await response.json();
        // Mongoose readyState 1 significa conectado
        return data.db === 1 || data.dbState === 1;
    } catch (error) {
        console.warn("⚠️ Backend inalcanzable:", error.message);
        return false;
    }
};

// --- DATA SYNC FUNCTIONS ---

export const getInstruments = async () => {
    try {
        const res = await fetch(`${API_URL}/instruments`);
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        console.warn("⚠️ Error fetching instruments:", e);
        return [];
    }
};

export const saveInstrument = async (instrument: any): Promise<boolean> => {
    try {
        const res = await fetch(`${API_URL}/instruments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(instrument)
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || 'Error en el servidor');
        }
        return true;
    } catch (e) {
        console.error("❌ Error saving instrument:", e.message);
        return false;
    }
};

export const deleteInstrument = async (id: number): Promise<boolean> => {
    try {
        const res = await fetch(`${API_URL}/instruments/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (e) {
        console.error("Error deleting instrument:", e);
        return false;
    }
};

export const seedInstruments = async (data: any[]): Promise<boolean> => {
    try {
        const res = await fetch(`${API_URL}/instruments/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    } catch (e) {
        console.error("Error seeding DB:", e);
        return false;
    }
};

// --- FILE FUNCTIONS ---

export const uploadFileToBackend = async (file: File, onProgress: (percent: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/upload`, true);
        
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch (e) { reject(new Error('Respuesta JSON inválida')); }
            } else {
                reject(new Error(`Error servidor: ${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Error de red al subir archivo'));
        
        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => {
    return `${API_URL}/files/${filename}`;
};
