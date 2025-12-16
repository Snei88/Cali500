

import React, { useState, useEffect, useRef } from 'react';
import { X, Save, CheckCircle2, Activity, ExternalLink, FileText, Check, UploadCloud, Download, Trash2, AlertCircle, FileBarChart, Scale, FolderOpen, CalendarRange, Target, Eye, FileSpreadsheet, File, HardDrive, Loader2, Server, Wifi, WifiOff } from 'lucide-react';
import { Instrumento } from '@/types';
import { CALI, AXIS_ORDER, STATUS_COLORS } from '@/utils/constants';
import { uploadFileToBackend, getFileDownloadUrl, checkBackendHealth } from '@/services/api'; 

interface InstrumentDrawerProps {
    instrument: Instrumento | null;
    onClose: () => void;
    role: string;
    onUpdate: (inst: Instrumento) => void;
    onCreate: (inst: Instrumento) => void;
    isCreating: boolean;
}

export const InstrumentDrawer: React.FC<InstrumentDrawerProps> = ({ instrument, onClose, role, onUpdate, onCreate, isCreating }) => {
    const [editData, setEditData] = useState<Instrumento | null>(null);
    
    // Refs for file inputs
    const fileInputMaestroRef = useRef<HTMLInputElement>(null);
    const fileInputAnalisisRef = useRef<HTMLInputElement>(null);
    const fileInputLeyRef = useRef<HTMLInputElement>(null);

    const [uploadError, setUploadError] = useState('');
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [isUploading, setIsUploading] = useState(false);
    const [isBackendOnline, setIsBackendOnline] = useState(false);

    // --- CONFIGURACIÓN DE MODO ---
    // Activado para usar MongoDB Atlas
    const USE_REAL_BACKEND = true; 

    useEffect(() => {
        setEditData(instrument);
        setUploadError('');
        setUploadProgress({});
        setIsUploading(false);

        // Verificar conexión al abrir
        if (USE_REAL_BACKEND) {
            checkBackendHealth().then(status => setIsBackendOnline(status));
        }
    }, [instrument]);

    if (!editData) return null;

    const handleInputChange = (field: keyof Instrumento, value: any) => {
        setEditData({ ...editData, [field]: value });
    }

    const handleSave = () => {
        if (!editData.nombre) {
            alert("El nombre es obligatorio");
            return;
        }
        if (isCreating) {
            onCreate(editData);
        } else {
            onUpdate(editData);
        }
        onClose();
    }

    // --- GENERIC FILE HANDLING LOGIC ---
    
    const formatFileSize = (base64String: string | undefined) => {
        if (!base64String) return '0 KB';
        if (base64String === 'STORED_IN_ATLAS' || USE_REAL_BACKEND) return 'Nube'; 
        const sizeInBytes = 4 * Math.ceil((base64String.length / 3)) * 0.5624896334383477;
        const sizeInKb = sizeInBytes / 1024;
        if (sizeInKb > 1024) {
            return `${(sizeInKb / 1024).toFixed(2)} MB`;
        }
        return `${sizeInKb.toFixed(0)} KB`;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, prefix: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(prev => ({ ...prev, [prefix]: 0 }));
        setUploadError('');

        if (USE_REAL_BACKEND) {
            // Verificar estado antes de intentar
            if (!isBackendOnline) {
                // Re-verificar por si acaso se conectó hace poco
                const status = await checkBackendHealth();
                setIsBackendOnline(status);
                if (!status) {
                    setUploadError('Error: No hay conexión con el servidor Backend.');
                    setIsUploading(false);
                    return;
                }
            }

            try {
                const uploadedFile = await uploadFileToBackend(file, (percent) => {
                    setUploadProgress(prev => ({ ...prev, [prefix]: percent }));
                });
                
                setEditData(prev => ({
                    ...prev!,
                    [`${prefix}nombre`]: uploadedFile.filename, // Guardamos el nombre generado por el server
                    [`${prefix}base64`]: 'STORED_IN_ATLAS', // Flag para saber que está en backend
                    [`${prefix}tipo`]: file.type
                }));
            } catch (error: any) {
                console.error("Upload Error:", error);
                setUploadError(`Fallo al subir: ${error.message}`);
            } finally {
                setIsUploading(false);
                setUploadProgress(prev => { const n = {...prev}; delete n[prefix]; return n; });
            }

        } else {
            // --- MODO DEMO / PROTOTIPO (LocalStorage) ---
            const DEMO_LIMIT_MB = 5; 
            
            if (file.size > DEMO_LIMIT_MB * 1024 * 1024) {
                setUploadError(`MODO DEMO: Límite de ${DEMO_LIMIT_MB}MB. Para archivos grandes conecta el Backend.`);
                setIsUploading(false);
                return;
            }

            // Simular progreso
            let progress = 0;
            const interval = setInterval(() => {
                progress += 15;
                setUploadProgress(prev => ({ ...prev, [prefix]: Math.min(progress, 99) }));
                
                if (progress >= 100) {
                    clearInterval(interval);
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        if (evt.target?.result) {
                            setEditData(prev => ({
                                ...prev!,
                                [`${prefix}nombre`]: file.name,
                                [`${prefix}base64`]: evt.target.result as string,
                                [`${prefix}tipo`]: file.type
                            }));
                            setUploadError('');
                            setIsUploading(false);
                            setUploadProgress(prev => { const n = {...prev}; delete n[prefix]; return n; });
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }, 150);
        }
        
        e.target.value = ''; 
    };

    const handleRemoveFile = (prefix: string) => {
        if (window.confirm('¿Estás seguro de eliminar el documento adjunto?')) {
            // Si estuviéramos en backend real, aquí llamaríamos a deleteFile(id)
            setEditData({
                ...editData,
                [`${prefix}nombre`]: undefined,
                [`${prefix}base64`]: undefined,
                [`${prefix}tipo`]: undefined
            });
        }
    };

    const handleDownloadFile = (prefix: string) => {
        const base64 = editData[`${prefix}base64` as keyof Instrumento];
        const nombre = editData[`${prefix}nombre` as keyof Instrumento];

        if (!base64 || !nombre) return;

        if (base64 === 'STORED_IN_ATLAS' || USE_REAL_BACKEND) {
            window.open(getFileDownloadUrl(nombre as string), '_blank');
        } else {
            const link = document.createElement('a');
            link.href = base64 as string;
            link.download = nombre as string;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const getFileIcon = (fileName: string) => {
        if (fileName.endsWith('.pdf')) return FileText;
        if (fileName.match(/\.(xls|xlsx|csv)$/)) return FileSpreadsheet;
        return File;
    };

    const FileUploadBox = ({ title, prefix, inputRef, icon: DefaultIcon, colorClass }: any) => {
        const fileName = editData[`${prefix}nombre` as keyof Instrumento] as string;
        const fileBase64 = editData[`${prefix}base64` as keyof Instrumento] as string;
        const DisplayIcon = fileName ? getFileIcon(fileName) : DefaultIcon;
        const progress = uploadProgress[prefix];
        const isThisUploading = progress !== undefined;
        
        return (
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block mb-1 flex items-center gap-1.5">
                    <DefaultIcon className={`h-3.5 w-3.5 ${colorClass}`} />
                    {title}
                </label>
                
                {isThisUploading ? (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                            <span className="text-xs text-slate-500 font-medium">
                                {USE_REAL_BACKEND ? 'Enviando a Atlas...' : 'Procesando...'}
                            </span>
                            <span className="text-xs text-indigo-600 font-bold ml-auto">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                ) : fileName ? (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-slate-100 rounded text-slate-500 relative">
                                <DisplayIcon className="h-4 w-4" />
                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-2 h-2 border border-white"></div>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs text-slate-700 truncate font-medium max-w-[150px]" title={fileName}>{fileName}</span>
                                <span className="text-[10px] text-slate-400">
                                    {formatFileSize(fileBase64)}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => handleRemoveFile(prefix)} className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors" title="Eliminar archivo">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div 
                        onClick={() => !isUploading && inputRef.current?.click()}
                        className={`border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-white hover:border-indigo-400 rounded-lg p-4 cursor-pointer text-center transition-all group flex flex-col items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <input 
                            type="file" 
                            ref={inputRef} 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, prefix)}
                        />
                        <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-xs text-slate-500 group-hover:text-indigo-600 font-medium">Click para cargar (Soporte 2GB+)</span>
                    </div>
                )}
            </div>
        );
    };

    const FileDownloadButton = ({ title, prefix, icon: Icon, colorClass, bgClass, description }: any) => {
        const fileName = editData[`${prefix}nombre` as keyof Instrumento] as string;
        const fileBase64 = editData[`${prefix}base64` as keyof Instrumento] as string;

        if (!fileName) return null;
        const DisplayIcon = getFileIcon(fileName);

        return (
            <button 
                onClick={() => handleDownloadFile(prefix)}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group text-left"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2.5 ${bgClass} ${colorClass} rounded-lg group-hover:scale-105 transition-transform`}>
                        <DisplayIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5 block">{title}</span>
                        <span className="text-xs font-bold text-slate-700 block truncate leading-tight">{fileName}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">{formatFileSize(fileBase64)}</span>
                    </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Download className="h-4 w-4" />
                </div>
            </button>
        );
    };

    const isAdmin = role === 'administrador';

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col slide-in-right border-l border-slate-100">
                {/* Header */}
                <div className="h-40 relative shrink-0 overflow-hidden" style={{ backgroundColor: CALI.MORADO }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-[#1E1B4B] opacity-90"></div>
                    <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="relative h-full p-6 flex flex-col justify-end text-white">
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 border border-white/10 backdrop-blur-sm shadow-sm">
                                {isCreating ? 'NUEVO' : `ID: ${editData.id}`}
                            </span>
                            {!isCreating && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-500/20 backdrop-blur-sm">{editData.tipo}</span>}
                        </div>
                        {isCreating ? (
                            <input 
                                type="text" 
                                value={editData.nombre} 
                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                placeholder="Nombre del Instrumento"
                                className="bg-transparent text-xl font-bold placeholder-white/50 border-b border-white/20 pb-1 focus:border-white focus:outline-none w-full"
                                autoFocus
                            />
                        ) : (
                            <h2 className="text-xl font-bold leading-tight drop-shadow-md">{editData.nombre}</h2>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
                    
                    {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
                    <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                        <div className="absolute top-4 left-0 w-1 h-8 bg-indigo-500 rounded-r"></div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 pl-2 flex items-center gap-2">
                            Información General
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <CalendarRange className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-semibold text-slate-600 uppercase">Vigencia</span>
                                </div>
                                <div className="text-sm font-bold text-slate-800">
                                    {isCreating || isAdmin ? (
                                        <div className="flex items-center gap-1">
                                            <input 
                                                type="number" 
                                                className="bg-white w-16 text-center border border-slate-200 rounded px-1 text-xs py-0.5 focus:border-indigo-500 outline-none" 
                                                value={editData.inicio} 
                                                onChange={(e) => handleInputChange('inicio', Number(e.target.value))} 
                                                disabled={!isAdmin && !isCreating}
                                            /> 
                                            <span className="text-slate-400">-</span>
                                            <input 
                                                type="text" 
                                                className="bg-white w-20 text-center border border-slate-200 rounded px-1 text-xs py-0.5 focus:border-indigo-500 outline-none" 
                                                value={editData.fin} 
                                                onChange={(e) => handleInputChange('fin', e.target.value === 'Permanente' ? 'Permanente' : Number(e.target.value))} 
                                                disabled={!isAdmin && !isCreating}
                                            />
                                        </div>
                                    ) : (
                                        `${editData.inicio} - ${editData.fin}`
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Estado</span>
                                    {isAdmin || isCreating ? (
                                        <select 
                                            className="w-full text-xs font-semibold p-2 rounded border border-slate-200 bg-white focus:border-indigo-500 outline-none"
                                            value={editData.estado}
                                            onChange={(e) => handleInputChange('estado', e.target.value)}
                                        >
                                            {Object.keys(STATUS_COLORS).map(st => <option key={st} value={st}>{st}</option>)}
                                        </select>
                                    ) : (
                                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${STATUS_COLORS[editData.estado]}`}>
                                            {editData.estado}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Temporalidad</span>
                                    {isAdmin || isCreating ? (
                                        <input 
                                            type="text" 
                                            className="w-full text-xs font-semibold p-2 rounded border border-slate-200 bg-white focus:border-indigo-500 outline-none"
                                            value={editData.temporalidad}
                                            onChange={(e) => handleInputChange('temporalidad', e.target.value)}
                                        />
                                    ) : (
                                        <span className="text-xs font-semibold text-slate-700 block p-1">{editData.temporalidad}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 flex items-center gap-1">
                                    <Target className="h-3 w-3" /> Eje Estratégico
                                </span>
                                {isAdmin || isCreating ? (
                                    <select 
                                        className="w-full text-xs font-semibold p-2 rounded border border-slate-200 bg-white focus:border-indigo-500 outline-none"
                                        value={editData.eje}
                                        onChange={(e) => handleInputChange('eje', e.target.value)}
                                    >
                                        {AXIS_ORDER.map(ax => <option key={ax} value={ax}>{ax}</option>)}
                                    </select>
                                ) : (
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs font-medium text-slate-700 leading-snug">
                                        {editData.eje}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN 2: SEGUIMIENTO Y MONITOREO */}
                    <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                        <div className="absolute top-4 left-0 w-1 h-8 bg-emerald-500 rounded-r"></div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 pl-2 flex items-center gap-2">
                            Seguimiento y Monitoreo
                        </h3>

                        {isAdmin ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600">¿Requiere Seguimiento?</span>
                                    <button 
                                        onClick={() => handleInputChange('seguimiento', editData.seguimiento === 'Si' ? 'No' : 'Si')}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${editData.seguimiento === 'Si' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-slate-200 border-slate-300 text-slate-500'}`}
                                    >
                                        {editData.seguimiento === 'Si' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                        {editData.seguimiento === 'Si' ? 'SI' : 'NO'}
                                    </button>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1.5 flex items-center gap-1.5">
                                        <Eye className="h-3.5 w-3.5 text-violet-500" />
                                        Mecanismo / Observatorio Asociado
                                    </label>
                                    <input 
                                        type="text" 
                                        value={editData.observatorio || ''}
                                        onChange={(e) => handleInputChange('observatorio', e.target.value)}
                                        placeholder="Ej: Observatorio de Seguridad..."
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                <div className={`p-3 rounded-lg border flex items-center justify-between ${editData.seguimiento === 'Si' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <span className="text-xs font-medium text-slate-600">Requiere Seguimiento</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${editData.seguimiento === 'Si' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                        {editData.seguimiento === 'Si' ? 'SI' : 'NO'}
                                    </span>
                                </div>
                                {editData.observatorio && (
                                    <div className="p-3 rounded-lg border border-violet-100 bg-violet-50/50">
                                        <span className="text-[10px] text-violet-400 font-bold uppercase block mb-1">Mecanismo / Observatorio</span>
                                        <div className="flex items-center gap-2 text-violet-700 font-semibold text-xs">
                                            <Eye className="h-3.5 w-3.5" />
                                            {editData.observatorio}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* SECCIÓN 3: REPOSITORIO DIGITAL */}
                    <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                        <div className="absolute top-4 left-0 w-1 h-8 bg-amber-500 rounded-r"></div>
                        <div className="flex items-center justify-between mb-4 pl-2">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                Repositorio Digital
                            </h3>
                            {uploadError && (
                                <span title={uploadError} className="animate-pulse">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                </span>
                            )}
                        </div>

                        {uploadError && (
                            <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100">
                                {uploadError}
                            </div>
                        )}

                        <div className={`mb-4 flex items-center justify-between gap-2 p-2 rounded-lg text-[10px] ${isBackendOnline ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'}`}>
                            <div className="flex items-center gap-2">
                                {isBackendOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                                <span>
                                    {isBackendOnline 
                                        ? "Conectado a Atlas (2GB+)" 
                                        : "Offline (Sin conexión al Servidor)"}
                                </span>
                            </div>
                            {USE_REAL_BACKEND && !isBackendOnline && <span className="font-bold">Revisar Logs</span>}
                        </div>

                        <div className="space-y-5">
                            {isAdmin ? (
                                <>
                                    <FileUploadBox 
                                        title="Documento Maestro (Plan/Política)" 
                                        prefix="archivo_" 
                                        inputRef={fileInputMaestroRef} 
                                        icon={FileText} 
                                        colorClass="text-indigo-500"
                                    />
                                    <div className="h-px bg-slate-100"></div>
                                    <FileUploadBox 
                                        title="Análisis Técnico / Reporte de Seguimiento" 
                                        prefix="archivo_analisis_" 
                                        inputRef={fileInputAnalisisRef} 
                                        icon={FileBarChart} 
                                        colorClass="text-amber-500"
                                    />
                                    <div className="h-px bg-slate-100"></div>
                                    <FileUploadBox 
                                        title="Marco Normativo (Ley/Acuerdo/Decreto)" 
                                        prefix="archivo_ley_" 
                                        inputRef={fileInputLeyRef} 
                                        icon={Scale} 
                                        colorClass="text-emerald-600"
                                    />
                                </>
                            ) : (
                                <>
                                    {(!editData.archivo_nombre && !editData.archivo_analisis_nombre && !editData.archivo_ley_nombre) ? (
                                        <div className="text-center py-8 text-slate-400 text-xs border-2 border-dashed border-slate-100 rounded-lg">
                                            <FolderOpen className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                                            No hay documentos digitales disponibles en este momento.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <FileDownloadButton 
                                                title="Documento Maestro" 
                                                prefix="archivo_" 
                                                icon={FileText} 
                                                colorClass="text-indigo-600" 
                                                bgClass="bg-indigo-50"
                                                description="Documento principal del instrumento"
                                            />
                                            <FileDownloadButton 
                                                title="Análisis Técnico" 
                                                prefix="archivo_analisis_" 
                                                icon={FileBarChart} 
                                                colorClass="text-amber-600" 
                                                bgClass="bg-amber-50"
                                                description="Reporte de análisis y seguimiento"
                                            />
                                            <FileDownloadButton 
                                                title="Marco Normativo" 
                                                prefix="archivo_ley_" 
                                                icon={Scale} 
                                                colorClass="text-emerald-700" 
                                                bgClass="bg-emerald-50"
                                                description="Política pública o ley asociada"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </section>

                    {/* ENLACES EXTERNOS */}
                    {(editData.enlace || editData.pdf_informe || isAdmin) && (
                        <div className="space-y-3 pt-2">
                            {isAdmin && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase">Enlaces Externos (Opcional)</h4>
                                    <input 
                                        type="text" 
                                        value={editData.enlace || ''} 
                                        onChange={(e) => handleInputChange('enlace', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs focus:border-indigo-500 outline-none"
                                        placeholder="URL Sitio Web del Instrumento"
                                    />
                                </div>
                            )}

                            {!isAdmin && editData.enlace && (
                                <a 
                                    href={editData.enlace} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="group flex items-center justify-center gap-2 w-full p-4 rounded-xl text-white font-semibold text-sm shadow-lg transform hover:-translate-y-0.5 transition-all"
                                    style={{ backgroundColor: CALI.TURQUESA }}
                                >
                                    Visitar Sitio Web Oficial
                                    <ExternalLink className="h-4 w-4 group-hover:ml-1 transition-all" />
                                </a>
                            )}
                        </div>
                    )}

                    {/* Save Button (Admin) */}
                    {role === 'administrador' && (
                        <div className="pt-4 sticky bottom-0 bg-slate-50 pb-2 z-10">
                            <button 
                                onClick={handleSave}
                                disabled={isUploading}
                                className={`w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xl shadow-indigo-600/20 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Save className="h-4 w-4" />
                                {isCreating ? 'Crear Instrumento' : 'Guardar Cambios'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
