
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal 
    ? 'http://localhost:8080/api' 
    : 'https://vision-cali-backend.onrender.com/api';

export const checkBackendHealth = async () => {
    try {
        const res = await fetch(`${API_URL}/health`);
        const data = await res.json();
        return data.db === 1;
    } catch (e) { return false; }
};

export const getInstruments = async () => {
    try {
        const res = await fetch(`${API_URL}/instruments`);
        return res.ok ? await res.json() : null;
    } catch (e) { return null; }
};

export const saveInstrument = async (instrument: any) => {
    try {
        const res = await fetch(`${API_URL}/instruments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(instrument)
        });
        if (res.status === 507) return { success: false, error: 'DB_FULL' };
        return { success: res.ok };
    } catch (e) { return { success: false, error: 'NETWORK_ERROR' }; }
};

export const deleteInstrument = async (id: number) => {
    try {
        const res = await fetch(`${API_URL}/instruments/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (e) { return false; }
};

export const purgeDatabase = async () => {
    try {
        const res = await fetch(`${API_URL}/instruments/purge`, { method: 'DELETE' });
        return res.ok;
    } catch (e) { return false; }
};

export const seedInstruments = async (data: any[]) => {
    for (const item of data) { await saveInstrument(item); }
};

export const uploadFileToBackend = async (file: File, onProgress: (p: number) => void) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/upload`, true);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
        xhr.onload = () => {
            if (xhr.status === 507) reject(new Error('DB_FULL'));
            else if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
            else reject(new Error('Error en subida'));
        };
        xhr.onerror = () => reject(new Error('Error de red'));
        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => `${API_URL}/files/${filename}`;
