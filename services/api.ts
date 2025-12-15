

// Configuración de la API

// -----------------------------------------------------------------------------
// PASO ÚNICO PARA CONECTAR:
// Cuando generes tu dominio público en Zeabur (ej: https://vision-cali.zeabur.app),
// pégalo dentro de las comillas de abajo.
// -----------------------------------------------------------------------------
const ZEABUR_DOMAIN: string = 'https://cali500baceknd.zeabur.app'; 

const getBaseUrl = () => {
    // 1. Si hay un dominio de Zeabur configurado, construimos la ruta API.
    if (ZEABUR_DOMAIN) {
        // Quitamos la barra al final si el usuario la puso (ej: .app/ -> .app)
        const cleanDomain = (ZEABUR_DOMAIN as string).replace(/\/$/, ""); 
        return `${cleanDomain}/api`;
    }

    // 2. Si estamos corriendo en localhost (tu PC), usa el puerto 5000
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:5000/api';
    }

    // 3. Fallback: Si estamos en producción (GitHub Pages) pero olvidaste poner la URL
    console.warn("⚠️ ADVERTENCIA: Estás en producción pero no has configurado la URL del backend.");
    return 'http://localhost:5000/api';
};

const API_URL = getBaseUrl();

export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/health`);
        return response.ok;
    } catch (error) {
        console.log("Backend offline o error de red:", error);
        return false;
    }
};

export const uploadFileToBackend = async (file: File, onProgress: (percent: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        xhr.open('POST', `${API_URL}/upload`, true);

        // Progreso de subida
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                onProgress(Math.round(percentComplete));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.file); // Retorna metadata del archivo (filename, id)
            } else {
                reject(new Error('Error en la subida: ' + xhr.statusText));
            }
        };

        xhr.onerror = () => reject(new Error('Error de red al conectar con el servidor'));
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => {
    return `${API_URL}/files/${filename}`;
};
