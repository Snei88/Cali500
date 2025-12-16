
// Configuración de la API

// FORZAMOS ENTORNO LOCAL PARA PRUEBAS
const API_URL = 'http://localhost:8080/api';

export const checkBackendHealth = async (): Promise<boolean> => {
    console.log(`🩺 [API] Verificando salud del sistema en: ${API_URL}/health`);
    
    // Timeout corto para local
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
        const response = await fetch(`${API_URL}/health`, { 
            signal: controller.signal,
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (!response.ok) return false;
        
        const data = await response.json();
        console.log("📦 [API Local] Respuesta:", data);
        
        return data.dbState === 1;

    } catch (error) {
        console.error("🔥 [API Local] El servidor local no responde. Asegurate de ejecutar 'node server.js'", error);
        return false;
    }
};

export const uploadFileToBackend = async (file: File, onProgress: (percent: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadUrl = `${API_URL}/upload`;
        console.log(`🚀 [API] Subiendo a Local: ${uploadUrl}`);

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);
        
        xhr.open('POST', uploadUrl, true);
        
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                onProgress(Math.round(percentComplete));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log("✅ [API] Subida completada:", response);
                    resolve(response.file || response);
                } catch (e) {
                    reject(new Error('Respuesta inválida del servidor'));
                }
            } else {
                console.error(`❌ [API] Error Server: ${xhr.responseText}`);
                reject(new Error(`Error ${xhr.status}: ${xhr.responseText}`));
            }
        };

        xhr.onerror = () => {
            reject(new Error('Error de conexión con localhost.'));
        };
        
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => {
    return `${API_URL}/files/${filename}`;
};
