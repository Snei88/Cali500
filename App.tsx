
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
import { getInstruments, saveInstrument, deleteInstrument, seedInstruments } from './services/api';

const App = () => {
    // --- STATE ---
    const [instrumentsData, setInstrumentsData] = useState<Instrumento[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [currentView, setCurrentView] = useState<'analitica' | 'ecosistema' | 'mapa'>('analitica');
    const [selectedInstrument, setSelectedInstrument] = useState<Instrumento | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEje, setFilterEje] = useState('Todos');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState<'usuario' | 'administrador'>('usuario');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, type: 'success' | 'error', title: string, message: string}>({
        isOpen: false, type: 'success', title: '', message: ''
    });
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // --- INITIAL DATA LOAD (FROM CLOUD) ---
    useEffect(() => {
        const initData = async () => {
            setIsLoadingData(true);
            try {
                // 1. Intentar obtener datos de la nube
                const cloudData = await getInstruments();
                
                if (cloudData && cloudData.length > 0) {
                    console.log("☁️ Datos cargados desde la nube.");
                    setInstrumentsData(cloudData);
                } else {
                    // 2. Si la nube está vacía, usar datos estáticos y sincronizarlos (Seed)
                    console.log("🌱 Base de datos vacía. Iniciando carga inicial...");
                    setInstrumentsData(instrumentos as Instrumento[]);
                    await seedInstruments(instrumentos);
                }
            } catch (error) {
                console.error("Error inicializando datos:", error);
                // Fallback a datos locales si todo falla
                setInstrumentsData(instrumentos as Instrumento[]);
            } finally {
                setIsLoadingData(false);
            }
        };
        initData();
        
        // Check auth session
        const session = sessionStorage.getItem('cali500_auth');
        if (session === 'true') setIsAuthenticated(true);
    }, []);

    const showAlert = (type: 'success' | 'error', title: string, message: string) => {
        setAlertConfig({ isOpen: true, type, title, message });
    };

    // --- AUTH ACTIONS ---
    const handleLoginRequest = () => {
        if (isAuthenticated) setUserRole('administrador');
        else setIsLoginOpen(true);
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

    // --- DATA ACTIONS (CLOUD SYNCED) ---

    const handleUpdateInstrument = async (updated: Instrumento) => {
        // Optimistic Update (UI update immediately)
        setInstrumentsData(prevData => prevData.map(item => item.id === updated.id ? updated : item));
        // Cloud Save
        await saveInstrument(updated);
    };

    const handleDeleteInstrument = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar este instrumento?')) {
            setInstrumentsData(prevData => prevData.filter(item => item.id !== id));
            await deleteInstrument(id);
        }
    };

    const handleCreateInstrument = async (newItem: Instrumento) => {
        const maxId = instrumentsData.length > 0 ? Math.max(...instrumentsData.map(i => i.id)) : 0;
        const instrumentWithId = { ...newItem, id: maxId + 1 };
        
        setInstrumentsData([...instrumentsData, instrumentWithId]);
        setIsCreating(false);
        setSelectedInstrument(null);
        showAlert('success', 'Instrumento Creado', `Se ha agregado "${newItem.nombre}" correctamente.`);
        
        await saveInstrument(instrumentWithId);
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

    const handleResetData = async () => {
        if (window.confirm('¿Restaurar datos? Esto reiniciará la base de datos con la información por defecto.')) {
            // En este caso simple, forzamos los datos estáticos localmente y los mandamos a guardar uno a uno o re-semillamos
            // Para mantenerlo simple y seguro, solo recargamos la página o reseteamos localmente y dejamos que el usuario edite.
            // Una implementación real requeriría un endpoint "wipe & seed".
            alert("Contacte al administrador de TI para un reseteo completo de la Base de Datos en la nube.");
        }
    };

    // --- EXPORT / IMPORT LOGIC ---
    const handleExportExcel = () => {
        if (userRole !== 'administrador') {
            setIsContactModalOpen(true);
            return;
        }
        const ws = XLSX.utils.json_to_sheet(instrumentsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Instrumentos");
        XLSX.writeFile(wb, `VisionCali500_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target?.result;
            if (!bstr) return;
            try {
                const wb = XLSX.read(bstr, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const importedData = XLSX.utils.sheet_to_json(ws) as any[];
                
                if (!importedData.length) {
                    showAlert('error', 'Error', "Archivo vacío.");
                    return;
                }

                // Simple import logic: Add new ones
                let maxId = instrumentsData.length > 0 ? Math.max(...instrumentsData.map(i => i.id)) : 0;
                const newItems: Instrumento[] = [];
                const currentIds = new Set(instrumentsData.map(i => i.id));

                for (const row of importedData) {
                     if (!row.nombre || !row.tipo) continue;
                     if (row.id && currentIds.has(row.id)) continue;

                     let newId = row.id || ++maxId;
                     if (typeof newId === 'number' && newId > maxId) maxId = newId;

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
                    currentIds.add(newId);
                    
                    // Save to cloud individually (simple approach)
                    await saveInstrument(newItem);
                }
                
                if (newItems.length > 0) {
                    setInstrumentsData(prev => [...prev, ...newItems]);
                    showAlert('success', 'Importación Exitosa', `Se agregaron ${newItems.length} instrumentos y se sincronizaron con la nube.`);
                } else {
                    showAlert('error', 'Sin Cambios', "No se encontraron registros nuevos válidos.");
                }
            } catch (error) {
                showAlert('error', 'Error', "Fallo al leer el archivo Excel.");
            }
        };
        reader.readAsBinaryString(file);
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
        
        const estadosMap: Record<string, number> = {
            'Permanente': 0, 'En Ejecución': 0, 'En Actualización': 0, 'Finalizado': 0
        };

        sourceData.forEach(i => {
            let st: string = i.estado;
            if (st === 'En proyecto') st = 'En Actualización';
            if (st === 'Finalizada') st = 'Finalizado';
            if (estadosMap[st] !== undefined) estadosMap[st]++;
        });

        const byType = Object.entries(sourceData.reduce((acc: any, curr) => {
            acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
            return acc;
        }, {})).map(([name, value]) => ({ name, value: Number(value) })).sort((a, b) => b.value - a.value);

        const byEje = AXIS_ORDER.map(eje => ({
            name: eje,
            shortName: eje.split(' ')[0],
            count: sourceData.filter(i => i.eje === eje).length
        }));

        return { total, conSeguimiento, sinSeguimiento, cobertura, estadosMap, byType, byEje };
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

    if (isLoadingData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 font-medium animate-pulse">Sincronizando con el Ecosistema...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
            <Sidebar 
                currentView={currentView} 
                setCurrentView={(view) => { setCurrentView(view); setIsSidebarOpen(false); }} 
                instrumentsCount={instrumentsData.length} 
                userRole={userRole} 
                handleResetData={handleResetData}
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                isOpen={isSidebarOpen}
                closeSidebar={() => setIsSidebarOpen(false)}
            />
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
                    {currentView === 'analitica' && <AnalyticsView stats={stats} />}
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
                    {currentView === 'mapa' && <CircularMap instruments={filteredData} onSelect={setSelectedInstrument} />}
                </div>
                <InstrumentDrawer 
                    instrument={selectedInstrument} 
                    onClose={() => { setSelectedInstrument(null); setIsCreating(false); }} 
                    role={userRole}
                    onUpdate={handleUpdateInstrument}
                    onCreate={handleCreateInstrument}
                    isCreating={isCreating}
                />
                <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLoginSuccess} />
                <AlertModal 
                    isOpen={alertConfig.isOpen}
                    type={alertConfig.type}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                />
                <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
            </main>
        </div>
    );
};

export default App;
