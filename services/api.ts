
// Configuración de la API

// URL del Backend (Zeabur)
const ZEABUR_DOMAIN = 'https://cali500baceknd.zeabur.app';

const getBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        console.log("🌍 [API] Entorno: Producción (Zeabur)");
        return `${ZEABUR_DOMAIN}/api`;
    }
    console.log("🏠 [API] Entorno: Localhost");
    return 'http://localhost:8080/api';
};

const API_URL = getBaseUrl();

export const checkBackendHealth = async (): Promise<boolean> => {
    console.log(`🩺 [API] Verificando salud del sistema en: ${API_URL}/health`);
    
    // Timeout de 5 segundos para evitar bloqueos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`${API_URL}/health`, { 
            signal: controller.signal,
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`❌ [API] Error HTTP: ${response.status}`);
            return false;
        }
        
        const data = await response.json();
        console.log("📦 [API] Respuesta del Servidor:", data);
        
        // LÓGICA CRÍTICA CORREGIDA:
        // El backend envía 'dbState' (número). 1 = Conectado, 2 = Conectando, 0 = Desconectado.
        if (data.dbState === 1) {
            console.log("✅ [API] Conexión Establecida y DB Lista.");
            return true;
        } else {
            console.warn(`⚠️ [API] Backend responde, pero DB no está lista (Estado: ${data.dbState})`);
            return false;
        }

    } catch (error) {
        console.error("🔥 [API] Error de Red/CORS:", error);
        return false;
    }
};

export const uploadFileToBackend = async (file: File, onProgress: (percent: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadUrl = `${API_URL}/upload`;
        console.log(`🚀 [API] Subiendo archivo a: ${uploadUrl}`);

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
                    console.log("✅ [API] Carga completada:", response);
                    resolve(response.file || response);
                } catch (e) {
                    console.error("❌ [API] Error parseando respuesta JSON");
                    reject(new Error('Respuesta inválida del servidor'));
                }
            } else {
                console.error(`❌ [API] Fallo en servidor: ${xhr.responseText}`);
                reject(new Error(`Error ${xhr.status}: Fallo al guardar archivo`));
            }
        };

        xhr.onerror = () => {
            console.error("🔥 [API] Error de Red (Posible bloqueo CORS)");
            reject(new Error('Error de conexión. Verifica que el backend esté activo.'));
        };
        
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => {
    return `${API_URL}/files/${filename}`;
};
