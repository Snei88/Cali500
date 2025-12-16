// Configuración de la API Profesional
// Detecta automáticamente el entorno (Local vs Nube)

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Lógica de Selección de URL:
// 1. Si es Local -> Usa http://localhost:8080/api
// 2. Si es Producción -> Busca la variable REACT_APP_API_URL configurada en Vercel.
// 3. Si no hay variable -> Intenta usar una URL relativa (por si decidimos unificar todo en un solo server)
let API_URL = isLocal ? 'http://localhost:8080/api' : (process.env.REACT_APP_API_URL || '');

// Limpieza de URL: Asegurar que no termine en '/' duplicado si el usuario lo pone mal en la variable
if (API_URL.endsWith('/')) {
    API_URL = API_URL.slice(0, -1);
}

// Logs de Diagnóstico (Solo visibles en consola del navegador)
console.groupCollapsed("🚀 [SISTEMA] Configuración de Conexión");
console.log(`Modo: ${isLocal ? 'DESARROLLO (Local)' : 'PRODUCCIÓN (Nube)'}`);
console.log(`Backend URL: ${API_URL || '⚠️ NO CONFIGURADA'}`);
if (!isLocal && !API_URL) {
    console.error("❌ ERROR CRÍTICO: No se ha configurado la variable de entorno REACT_APP_API_URL en Vercel.");
    console.warn("La aplicación no podrá conectar con el servidor.");
}
console.groupEnd();

export const checkBackendHealth = async (): Promise<boolean> => {
    if (!API_URL) return false;
    try {
        const controller = new AbortController();
        // Timeout más corto en local para feedback rápido, más largo en nube por latencia
        const timeoutId = setTimeout(() => controller.abort(), isLocal ? 2000 : 8000);

        const response = await fetch(`${API_URL}/health`, { 
            signal: controller.signal,
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (!response.ok) return false;
        
        const data = await response.json();
        return data.dbState === 1; // 1 significa 'Conectado' en Mongoose

    } catch (error) {
        // Silencioso en producción para no ensuciar consola, explícito en local
        if (isLocal) console.warn("⚠️ [API] Backend no disponible:", error);
        return false;
    }
};

export const uploadFileToBackend = async (file: File, onProgress: (percent: number) => void): Promise<any> => {
    if (!API_URL) throw new Error("URL de Backend no configurada");

    return new Promise((resolve, reject) => {
        const uploadUrl = `${API_URL}/upload`;

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
                    resolve(response.file || response);
                } catch (e) {
                    reject(new Error('Respuesta inválida del servidor (No es JSON)'));
                }
            } else {
                reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => {
            reject(new Error('Fallo de red al intentar subir el archivo.'));
        };
        
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => {
    if (!API_URL) return '#';
    return `${API_URL}/files/${filename}`;
};