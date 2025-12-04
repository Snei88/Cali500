
// URL del Backend (Cámbiala cuando despliegues el server.js)
const API_URL = 'http://localhost:5000/api'; 

export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/health`);
        return response.ok;
    } catch (error) {
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
                reject(new Error('Error en la subida'));
            }
        };

        xhr.onerror = () => reject(new Error('Error de red'));
        xhr.send(formData);
    });
};

export const getFileDownloadUrl = (filename: string) => {
    return `${API_URL}/files/${filename}`;
};
