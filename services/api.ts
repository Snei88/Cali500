

// Configuración de la API

// -----------------------------------------------------------------------------
// URL DE PRODUCCIÓN (ZEABUR)
// -----------------------------------------------------------------------------
const ZEABUR_DOMAIN: string = 'https://cali500baceknd.zeabur.app'; 

const getBaseUrl = () => {
    // Prioridad 1: Dominio de Zeabur configurado
    if (ZEABUR_DOMAIN) {
        // Asegurar que no tenga slash al final
        const cleanDomain = ZEABUR_DOMAIN.replace(/\/$/, ""); 
        // Si el dominio ya incluye /api (error común), no lo agregamos de nuevo
        if (cleanDomain.endsWith('/api')) return cleanDomain;
        return `${cleanDomain}/api`;
    }

    // Prioridad 2: Localhost
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:5000/api'; // O 8080 si lo corres localmente con ese puerto
    }

    return 'http://localhost:5000/api';
};

const API_URL = getBaseUrl();

console.log("🌐 Conectando a Backend en:", API_URL);

export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log("Health Check Status:", data);
        return response.ok && data.dbConnected;
    } catch (error) {
        console.error("❌ Backend offline o error de red:", error);
        return false;
    }
};

export const uploadFileToBackend = async (file: File, onProgress: (percent: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        const uploadUrl = `${API_URL}/upload`;
        console.log("📤 Subiendo archivo a:", uploadUrl);

        xhr.open('POST', uploadUrl, true);

        // Progreso de subida
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                onProgress(Math.round(percentComplete));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.file);
                } catch (e) {
                    reject(new Error('Respuesta inválida del servidor'));
                }
            } else {
                console.error("Error del servidor:", xhr.responseText);
                reject(new Error(`Error ${xhr.status}: ${xhr.statusText || 'Fallo en carga'}`));
            }
        };

        xhr.onerror = () => {
            console.error("Error de red XMLHttpRequest");
            reject(new Error('Error de red al conectar con el servidor. Verifica tu conexión a Internet o el estado del backend.'));
        };
        
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => {
    return `${API_URL}/files/${filename}`;
};
