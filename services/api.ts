
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
        const timeoutId = setTimeout(() => controller.abort(), isLocal ? 2000 : 15000);
        const response = await fetch(`${API_URL}/health`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) return false;
        const data = await response.json();
        return data.dbState === 1;
    } catch (error) {
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

export const saveInstrument = async (instrument: any) => {
    try {
        await fetch(`${API_URL}/instruments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(instrument)
        });
    } catch (e) {
        console.error("Error saving instrument:", e);
    }
};

export const deleteInstrument = async (id: number) => {
    try {
        await fetch(`${API_URL}/instruments/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Error deleting instrument:", e);
    }
};

export const seedInstruments = async (data: any[]) => {
    try {
        await fetch(`${API_URL}/instruments/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.error("Error seeding DB:", e);
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
                } catch (e) { reject(new Error('Invalid JSON response')); }
            } else {
                reject(new Error(`Error ${xhr.status}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network Error'));
        
        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => {
    return `${API_URL}/files/${filename}`;
};
