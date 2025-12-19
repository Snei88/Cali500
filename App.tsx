
import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { instrumentos } from './data';
import { Instrumento, Stats } from './types';
import { AXIS_ORDER } from './utils/constants';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { EcosystemView } from './components/views/EcosystemView';
import { DataView } from './components/views/DataView';
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

    const [activeSection, setActiveSection] = useState<'home' | 'dashboard'>('home');
    const [currentView, setCurrentView] = useState<'analitica' | 'ecosistema' | 'mapa' | 'datos'>('analitica');
    
    const [selectedInstrument, setSelectedInstrument] = useState<Instrumento | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEje, setFilterEje] = useState('Todos');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
    const [userRole, setUserRole] = useState<'usuario' | 'administrador'>('usuario');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, type: 'success' | 'error', title: string, message: string}>({
        isOpen: false, type: 'success', title: '', message: ''
    });
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // --- INITIAL DATA LOAD ---
    useEffect(() => {
        const initData = async () => {
            setIsLoadingData(true);
            try {
                const cloudData = await getInstruments();
                if (cloudData && cloudData.length > 0) {
                    setInstrumentsData(cloudData);
                } else {
                    setInstrumentsData(instrumentos as Instrumento[]);
                    await seedInstruments(instrumentos);
                }
            } catch (error) {
                console.error("Error inicializando datos:", error);
                setInstrumentsData(instrumentos as Instrumento[]);
            } finally {
                setIsLoadingData(false);
            }
        };
        initData();
        const session = sessionStorage.getItem('cali500_auth');
        if (session === 'true') setIsAuthenticated(true);

        // Adjust sidebar on small screens
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, []);

    const showAlert = (type: 'success' | 'error', title: string, message: string) => {
        setAlertConfig({ isOpen: true, type, title, message });
    };

    // --- NAV ACTIONS ---
    const handleGoToDashboard = (view: 'analitica' | 'ecosistema' | 'mapa' | 'datos') => {
        setActiveSection('dashboard');
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- DATA ACTIONS ---
    const handleUpdateInstrument = async (updated: Instrumento) => {
        setInstrumentsData(prevData => prevData.map(item => item.id === updated.id ? updated : item));
        const success = await saveInstrument(updated);
        if (success) showAlert('success', 'Cambios Guardados', `El instrumento "${updated.nombre}" se actualizó.`);
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
        await saveInstrument(instrumentWithId);
    };

    const openCreateModal = () => {
        const emptyInstrument: Instrumento = {
            id: 0, nombre: '', tipo: 'Plan', eje: 'Transversal', inicio: new Date().getFullYear(),
            fin: new Date().getFullYear() + 4, temporalidad: '4 años', estado: 'En proyecto',
            seguimiento: 'No', observatorio: '', enlace: '', pdf_informe: ''
        };
        setSelectedInstrument(emptyInstrument);
        setIsCreating(true);
    };

    // --- EXPORT / IMPORT ---
    const handleExportExcel = () => {
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
                let maxId = instrumentsData.length > 0 ? Math.max(...instrumentsData.map(i => i.id)) : 0;
                const newItems: Instrumento[] = [];
                for (const row of importedData) {
                    if (!row.nombre || !row.tipo) continue;
                    let newId = row.id || ++maxId;
                    const newItem: Instrumento = {
                        id: newId, nombre: String(row.nombre).trim(), tipo: row.tipo as any,
                        eje: row.eje as any || 'Transversal', inicio: Number(row.inicio) || new Date().getFullYear(),
                        fin: row.fin === 'Permanente' ? 'Permanente' : (Number(row.fin) || new Date().getFullYear() + 4),
                        temporalidad: row.temporalidad || '', estado: row.estado as any || 'En proyecto',
                        seguimiento: row.seguimiento === 'Si' ? 'Si' : 'No', observatorio: row.observatorio || '',
                        enlace: row.enlace || '', pdf_informe: row.pdf_informe || ''
                    };
                    newItems.push(newItem);
                    await saveInstrument(newItem);
                }
                if (newItems.length > 0) setInstrumentsData(prev => [...prev, ...newItems]);
            } catch (error) {
                showAlert('error', 'Error', "Fallo al leer el archivo Excel.");
            }
        };
        reader.readAsBinaryString(file);
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
        const estadosMap: Record<string, number> = { 'Permanente': 0, 'En Ejecución': 0, 'En Actualización': 0, 'Finalizado': 0 };
        sourceData.forEach(i => {
            let st: string = i.estado;
            if (st === 'En proyecto') st = 'En Actualización';
            if (st === 'Finalizada' || st === 'Finalizado') st = 'Finalizado';
            if (estadosMap[st] !== undefined) estadosMap[st]++;
        });
        const byType = Object.entries(sourceData.reduce((acc: any, curr) => {
            acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
            return acc;
        }, {})).map(([name, value]) => ({ name, value: Number(value) })).sort((a, b) => b.value - a.value);
        const byEje = AXIS_ORDER.map(eje => ({
            name: eje, shortName: eje.split(' ')[0], count: sourceData.filter(i => i.eje === eje).length
        }));
        return { total, conSeguimiento, sinSeguimiento, cobertura, estadosMap, byType, byEje };
    }, [filteredData]);

    const groupedData = useMemo(() => {
        const groups: Record<string, Instrumento[]> = {};
        AXIS_ORDER.forEach(axis => groups[axis] = []);
        filteredData.forEach(item => { if (groups[item.eje]) groups[item.eje].push(item); });
        return groups;
    }, [filteredData]);

    if (isLoadingData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 font-medium animate-pulse">Sincronizando Visión Cali 500+...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* NAVBAR GLOBAL PERSISTENTE - Z-60 */}
            <div className="sticky top-0 z-[60]">
                <Navbar 
                    activeSection={activeSection === 'home' ? 'home' : 'dashboard'} 
                    setActiveSection={(s) => setActiveSection(s as any)} 
                    onDashboardAction={handleGoToDashboard} 
                />
            </div>

            {activeSection === 'home' ? (
                <>
                    <main className="flex-1">
                        <HomeView stats={stats} onAction={handleGoToDashboard} />
                    </main>
                    <Footer 
                        activeSection={activeSection} 
                        setActiveSection={(s) => setActiveSection(s as any)} 
                        onDashboardAction={handleGoToDashboard}
                    />
                </>
            ) : (
                <div className="flex flex-1 overflow-hidden h-[calc(100vh-73px)] relative bg-slate-100">
                    <Sidebar 
                        currentView={currentView} 
                        setCurrentView={(view) => { setCurrentView(view as any); if (window.innerWidth < 768) setIsSidebarOpen(false); }} 
                        instrumentsCount={instrumentsData.length} 
                        userRole={userRole} 
                        handleResetData={() => {}}
                        isAuthenticated={isAuthenticated}
                        handleLogout={() => { setIsAuthenticated(false); setUserRole('usuario'); }}
                        isOpen={isSidebarOpen}
                        closeSidebar={() => setIsSidebarOpen(false)}
                    />
                    {/* Contenido Principal con margen dinámico para no solapar el sidebar en desktop */}
                    <div className={`flex-1 flex flex-col min-w-0 h-full relative overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-48' : 'ml-0'}`}>
                        <Header 
                            currentView={currentView}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterEje={filterEje}
                            setFilterEje={setFilterEje}
                            onExport={handleExportExcel}
                            onImport={handleImportExcel}
                            userRole={userRole}
                            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        />
                        <div className="flex-1 overflow-y-auto p-0 scroll-smooth custom-scrollbar bg-slate-50/50">
                            {currentView === 'analitica' && <div className="p-4 md:p-6"><AnalyticsView stats={stats} /></div>}
                            {currentView === 'ecosistema' && (
                                <div className="p-4 md:p-6">
                                    <EcosystemView 
                                        groupedData={groupedData} 
                                        userRole={userRole} 
                                        openCreateModal={openCreateModal} 
                                        setUserRole={setUserRole} 
                                        setSelectedInstrument={setSelectedInstrument} 
                                        handleDeleteInstrument={handleDeleteInstrument}
                                        onAdminRequest={() => setIsLoginOpen(true)}
                                    />
                                </div>
                            )}
                            {currentView === 'mapa' && <CircularMap instruments={filteredData} onSelect={setSelectedInstrument} />}
                            {currentView === 'datos' && <div className="p-4 md:p-6"><DataView instruments={filteredData} onSelect={setSelectedInstrument} /></div>}
                        </div>
                    </div>
                </div>
            )}
            
            <InstrumentDrawer 
                instrument={selectedInstrument} 
                onClose={() => { setSelectedInstrument(null); setIsCreating(false); }} 
                role={userRole}
                onUpdate={handleUpdateInstrument}
                onCreate={handleCreateInstrument}
                isCreating={isCreating}
            />
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={(s) => { if(s){ setIsAuthenticated(true); setUserRole('administrador'); setIsLoginOpen(false); }}} />
            <AlertModal 
                isOpen={alertConfig.isOpen}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
            />
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        </div>
    );
};

export default App;
