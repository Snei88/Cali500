
import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { instrumentos } from './data';
import { Instrumento, Stats } from './types';
import { AXIS_ORDER } from './utils/constants';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AnalyticsView } from './components/views/AnalyticsView';
import { EcosystemView } from './components/views/EcosystemView';
import { CircularMap } from './components/CircularMap';
import { InstrumentDrawer } from './components/InstrumentDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { AlertModal } from './components/ui/AlertModal';
import { ContactModal } from './components/ui/ContactModal';

const App = () => {
    // --- STATE ---
    
    // Initialize with persisted data if available
    const [instrumentsData, setInstrumentsData] = useState<Instrumento[]>(() => {
        const savedData = localStorage.getItem('cali500_instruments');
        return savedData ? JSON.parse(savedData) : (instrumentos as Instrumento[]);
    });

    const [currentView, setCurrentView] = useState<'analitica' | 'ecosistema' | 'mapa'>('analitica');
    const [selectedInstrument, setSelectedInstrument] = useState<Instrumento | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEje, setFilterEje] = useState('Todos');
    
    // Mobile Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Auth States
    const [userRole, setUserRole] = useState<'usuario' | 'administrador'>('usuario');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // Alert & Modal States
    const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, type: 'success' | 'error', title: string, message: string}>({
        isOpen: false, type: 'success', title: '', message: ''
    });
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('cali500_instruments', JSON.stringify(instrumentsData));
    }, [instrumentsData]);

    // Check for persisted session (optional, but good UX)
    useEffect(() => {
        const session = sessionStorage.getItem('cali500_auth');
        if (session === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // --- HELPER: SHOW ALERT ---
    const showAlert = (type: 'success' | 'error', title: string, message: string) => {
        setAlertConfig({ isOpen: true, type, title, message });
    };

    // --- AUTH ACTIONS ---

    const handleLoginRequest = () => {
        if (isAuthenticated) {
            setUserRole('administrador');
        } else {
            setIsLoginOpen(true);
        }
    };

    const handleLoginSuccess = (success: boolean) => {
        if (success) {
            setIsAuthenticated(true);
            setUserRole('administrador');
            setIsLoginOpen(false);
            sessionStorage.setItem('cali500_auth', 'true');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole('usuario');
        sessionStorage.removeItem('cali500_auth');
    };

    // --- DATA ACTIONS ---

    const handleUpdateInstrument = (updated: Instrumento) => {
        setInstrumentsData(prevData => prevData.map(item => item.id === updated.id ? updated : item));
    };

    const handleDeleteInstrument = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar este instrumento? Esta acción no se puede deshacer.')) {
            setInstrumentsData(prevData => prevData.filter(item => item.id !== id));
        }
    };

    const handleCreateInstrument = (newItem: Instrumento) => {
        // Generate new ID
        const maxId = instrumentsData.length > 0 ? Math.max(...instrumentsData.map(i => i.id)) : 0;
        const instrumentWithId = { ...newItem, id: maxId + 1 };
        setInstrumentsData([...instrumentsData, instrumentWithId]);
        setIsCreating(false);
        setSelectedInstrument(null);
        showAlert('success', 'Instrumento Creado', `Se ha agregado "${newItem.nombre}" al ecosistema correctamente.`);
    };

    const openCreateModal = () => {
        const emptyInstrument: Instrumento = {
            id: 0,
            nombre: '',
            tipo: 'Plan',
            eje: 'Transversal',
            inicio: new Date().getFullYear(),
            fin: new Date().getFullYear() + 4,
            temporalidad: '4 años',
            estado: 'En proyecto',
            seguimiento: 'No',
            observatorio: '',
            enlace: '',
            pdf_informe: ''
        };
        setSelectedInstrument(emptyInstrument);
        setIsCreating(true);
    };

    const handleResetData = () => {
        if (window.confirm('¿Estás seguro de restablecer los datos originales? Se perderán tus cambios locales.')) {
            setInstrumentsData(instrumentos as Instrumento[]);
            localStorage.removeItem('cali500_instruments');
            showAlert('success', 'Datos Restaurados', 'Se ha vuelto a la configuración inicial de instrumentos.');
        }
    };

    // --- EXPORT / IMPORT LOGIC ---

    const handleExportExcel = () => {
        // Verificar si es administrador
        if (userRole !== 'administrador') {
            setIsContactModalOpen(true);
            return;
        }

        const ws = XLSX.utils.json_to_sheet(instrumentsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Instrumentos");
        const dateStr = new Date().toISOString().split('T')[0];
        const fileName = `VisionCali500_Instrumentos_${dateStr}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            if (!bstr) return;

            try {
                // 1. Read the workbook
                const wb = XLSX.read(bstr, { type: 'binary' });
                
                // 2. Get first sheet
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                
                // 3. Convert to JSON with raw parsing first
                const importedData = XLSX.utils.sheet_to_json(ws) as any[];

                if (!importedData || importedData.length === 0) {
                    showAlert('error', 'Archivo Vacío', "El archivo parece estar vacío o no tiene el formato correcto.");
                    return;
                }

                // 4. Merge logic
                const currentIds = new Set(instrumentsData.map(i => i.id));
                let maxId = instrumentsData.length > 0 ? Math.max(...instrumentsData.map(i => i.id)) : 0;
                
                const newItems: Instrumento[] = [];
                let duplicatesCount = 0;
                let invalidCount = 0;

                importedData.forEach((row) => {
                    // Validar campos mínimos (Nombre y Tipo)
                    if (!row.nombre || !row.tipo) {
                        invalidCount++;
                        return;
                    }

                    // Si trae ID y ya existe, es duplicado (se ignora según requerimiento)
                    if (row.id && currentIds.has(row.id)) {
                        duplicatesCount++;
                        return;
                    }

                    // Determinar el nuevo ID
                    let newId = row.id;
                    if (!newId) {
                        // Si no trae ID (agregado manualmente en excel), asignar uno nuevo
                        maxId++;
                        newId = maxId;
                    } else {
                        // Si trae ID nuevo, asegurar que no colisione en el futuro
                        if (typeof newId === 'number' && newId > maxId) {
                            maxId = newId;
                        }
                    }

                    // Construir el objeto limpiando datos (por si vienen del excel como strings raros)
                    const newItem: Instrumento = {
                        id: newId,
                        nombre: String(row.nombre).trim(),
                        tipo: row.tipo,
                        eje: row.eje || 'Transversal',
                        inicio: Number(row.inicio) || new Date().getFullYear(),
                        fin: row.fin === 'Permanente' ? 'Permanente' : (Number(row.fin) || new Date().getFullYear() + 4),
                        temporalidad: row.temporalidad || '',
                        estado: row.estado || 'En proyecto',
                        seguimiento: row.seguimiento === 'Si' ? 'Si' : 'No',
                        observatorio: row.observatorio || '',
                        enlace: row.enlace || '',
                        pdf_informe: row.pdf_informe || ''
                    };

                    newItems.push(newItem);
                    currentIds.add(newId); // Agregar al set local para evitar duplicados dentro del mismo archivo
                });

                if (newItems.length > 0) {
                    setInstrumentsData(prev => [...prev, ...newItems]);
                    showAlert('success', 'Importación Exitosa', 
                        `Se han agregado ${newItems.length} nuevos instrumentos.\n\n` + 
                        `${duplicatesCount > 0 ? `• ${duplicatesCount} duplicados ignorados\n` : ''}` + 
                        `${invalidCount > 0 ? `• ${invalidCount} filas inválidas` : ''}`
                    );
                } else {
                    showAlert('error', 'Sin Cambios', 
                        `No se encontraron nuevos instrumentos para agregar.\n\n` + 
                        `${duplicatesCount > 0 ? `• ${duplicatesCount} duplicados encontrados\n` : ''}` +
                        `${invalidCount > 0 ? `• ${invalidCount} filas inválidas` : ''}`
                    );
                }

            } catch (error) {
                console.error("Error importando excel:", error);
                showAlert('error', 'Error de Procesamiento', "Hubo un error al leer el archivo. Asegúrate de que sea un Excel (.xlsx) válido.");
            }
        };

        reader.readAsBinaryString(file);
        
        // Reset input
        e.target.value = '';
    };

    // --- DATA PROCESSING ---

    const filteredData = useMemo(() => {
        return instrumentsData.filter(item => {
            const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                String(item.id).includes(searchTerm);
            const matchesEje = filterEje === 'Todos' || item.eje === filterEje;
            return matchesSearch && matchesEje;
        });
    }, [searchTerm, filterEje, instrumentsData]);

    const stats: Stats = useMemo(() => {
        const sourceData = filteredData;
        const total = sourceData.length;
        const conSeguimiento = sourceData.filter(i => i.seguimiento === 'Si').length;
        const sinSeguimiento = sourceData.filter(i => i.seguimiento !== 'Si').length;
        const cobertura = total > 0 ? ((conSeguimiento / total) * 100).toFixed(1) : '0';
        
        // Unificar estados para las tarjetas
        const estadosMap: Record<string, number> = {
            'Permanente': 0,
            'En Ejecución': 0,
            'En Actualización': 0,
            'Finalizado': 0
        };

        sourceData.forEach(i => {
            let st: string = i.estado;
            if (st === 'En proyecto') st = 'En Actualización'; // Simplify for stats
            if (st === 'Finalizada') st = 'Finalizado';
            
            if (estadosMap[st] !== undefined) estadosMap[st]++;
        });

        const byType = Object.entries(sourceData.reduce((acc: any, curr) => {
            acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
            return acc;
        }, {})).map(([name, value]) => ({ name, value: Number(value) })).sort((a, b) => b.value - a.value);

        const byEje = AXIS_ORDER.map(eje => ({
            name: eje,
            shortName: eje.split(' ')[0], // Simpler name for axis
            count: sourceData.filter(i => i.eje === eje).length
        }));

        return {
            total,
            conSeguimiento,
            sinSeguimiento,
            cobertura,
            estadosMap,
            byType,
            byEje
        };
    }, [filteredData]);

    const groupedData = useMemo(() => {
        const groups: Record<string, Instrumento[]> = {};
        AXIS_ORDER.forEach(axis => groups[axis] = []);
        filteredData.forEach(item => {
            if (!groups[item.eje]) groups[item.eje] = [];
            groups[item.eje].push(item);
        });
        return groups;
    }, [filteredData]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
            
            <Sidebar 
                currentView={currentView} 
                setCurrentView={(view) => {
                    setCurrentView(view);
                    setIsSidebarOpen(false); // Close sidebar on mobile when navigating
                }} 
                instrumentsCount={instrumentsData.length} 
                userRole={userRole} 
                handleResetData={handleResetData}
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                isOpen={isSidebarOpen}
                closeSidebar={() => setIsSidebarOpen(false)}
            />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-slate-50/50">
                
                <Header 
                    currentView={currentView}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterEje={filterEje}
                    setFilterEje={setFilterEje}
                    onExport={handleExportExcel}
                    onImport={handleImportExcel}
                    userRole={userRole}
                    toggleSidebar={toggleSidebar}
                />

                <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth relative custom-scrollbar">
                    
                    {/* View: Analítica */}
                    {currentView === 'analitica' && (
                        <AnalyticsView stats={stats} />
                    )}

                    {/* View: Ecosistema (Cards) */}
                    {currentView === 'ecosistema' && (
                        <EcosystemView 
                            groupedData={groupedData} 
                            userRole={userRole} 
                            openCreateModal={openCreateModal} 
                            setUserRole={setUserRole} 
                            setSelectedInstrument={setSelectedInstrument} 
                            handleDeleteInstrument={handleDeleteInstrument}
                            onAdminRequest={handleLoginRequest}
                        />
                    )}

                    {/* View: Mapa Circular */}
                    {currentView === 'mapa' && (
                         <CircularMap instruments={filteredData} onSelect={setSelectedInstrument} />
                    )}

                </div>
                
                {/* Details Drawer */}
                <InstrumentDrawer 
                    instrument={selectedInstrument} 
                    onClose={() => {
                        setSelectedInstrument(null);
                        setIsCreating(false);
                    }} 
                    role={userRole}
                    onUpdate={handleUpdateInstrument}
                    onCreate={handleCreateInstrument}
                    isCreating={isCreating}
                />

                {/* Login Modal */}
                <LoginModal 
                    isOpen={isLoginOpen} 
                    onClose={() => setIsLoginOpen(false)} 
                    onLogin={handleLoginSuccess} 
                />

                {/* Alert Modal */}
                <AlertModal 
                    isOpen={alertConfig.isOpen}
                    type={alertConfig.type}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                />

                {/* Contact Modal (Restricted Download) */}
                <ContactModal 
                    isOpen={isContactModalOpen}
                    onClose={() => setIsContactModalOpen(false)}
                />

            </main>
        </div>
    );
};

export default App;
