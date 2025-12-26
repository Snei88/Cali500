
import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { instrumentos } from './data';
import { Instrumento, Stats } from './types';
import { AXIS_ORDER } from './utils/constants';
import { calculateProgress, getSemaforoStatus } from './utils/helpers';
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
import { ChatBot } from './components/ChatBot';

const App = () => {
    const [instrumentsData, setInstrumentsData] = useState<Instrumento[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const isLocalMode = true;

    const [activeSection, setActiveSection] = useState<'home' | 'dashboard'>('home');
    const [currentView, setCurrentView] = useState<'analitica' | 'ecosistema' | 'mapa' | 'datos'>('analitica');
    
    const [selectedInstrument, setSelectedInstrument] = useState<Instrumento | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEje, setFilterEje] = useState('Todos');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState<'usuario' | 'administrador'>('usuario');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, type: 'success' | 'error', title: string, message: string}>({
        isOpen: false, type: 'success', title: '', message: ''
    });

    useEffect(() => {
        const initData = () => {
            setIsLoadingData(true);
            const local = localStorage.getItem('cali500_local_storage_data');
            if (local) {
                setInstrumentsData(JSON.parse(local));
            } else {
                setInstrumentsData(instrumentos as Instrumento[]);
                localStorage.setItem('cali500_local_storage_data', JSON.stringify(instrumentos));
            }
            setIsLoadingData(false);
        };
        initData();
        
        const session = sessionStorage.getItem('cali500_auth');
        if (session === 'true') {
            setIsAuthenticated(true);
            setUserRole('administrador');
        }

        if (window.innerWidth < 768) setIsSidebarOpen(false);
    }, []);

    const showAlert = (type: 'success' | 'error', title: string, message: string) => {
        setAlertConfig({ isOpen: true, type, title, message });
    };

    const handleGoToDashboard = (view: 'analitica' | 'ecosistema' | 'mapa' | 'datos') => {
        setActiveSection('dashboard');
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdateInstrument = (updated: Instrumento) => {
        const newData = instrumentsData.map(item => item.id === updated.id ? updated : item);
        setInstrumentsData(newData);
        localStorage.setItem('cali500_local_storage_data', JSON.stringify(newData));
        showAlert('success', 'Cambios Guardados', `Actualizado correctamente en todos los módulos.`);
    };

    const handleDeleteInstrument = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Eliminar instrumento?')) {
            const newData = instrumentsData.filter(item => item.id !== id);
            setInstrumentsData(newData);
            localStorage.setItem('cali500_local_storage_data', JSON.stringify(newData));
        }
    };

    const handleCreateInstrument = (newItem: Instrumento) => {
        const maxId = instrumentsData.length > 0 ? Math.max(...instrumentsData.map(i => i.id)) : 0;
        const instrumentWithId = { ...newItem, id: maxId + 1 };
        const newData = [...instrumentsData, instrumentWithId];
        setInstrumentsData(newData);
        localStorage.setItem('cali500_local_storage_data', JSON.stringify(newData));
        setIsCreating(false);
        setSelectedInstrument(null);
        showAlert('success', 'Creado', 'Instrumento añadido al ecosistema.');
    };

    const filteredData = useMemo(() => {
        return instrumentsData.filter(item => {
            const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.tipo.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEje = filterEje === 'Todos' || item.eje === filterEje;
            return matchesSearch && matchesEje;
        });
    }, [searchTerm, filterEje, instrumentsData]);

    const stats: Stats = useMemo(() => {
        const total = filteredData.length;
        const conSeguimiento = filteredData.filter(i => i.seguimiento === 'Si').length;
        const sinSeguimiento = total - conSeguimiento;
        const cobertura = total > 0 ? ((conSeguimiento / total) * 100).toFixed(1) : '0';
        
        const estadosMap: Record<string, number> = { 'Permanente': 0, 'En Ejecución': 0, 'En Actualización': 0, 'Finalizado': 0 };
        const semaforoMap = { critico: 0, intermedio: 0, optimo: 0 };

        filteredData.forEach(i => {
            let st: string = i.estado;
            if (st === 'En proyecto') st = 'En Actualización';
            if (st === 'Finalizada' || st === 'Finalizado') st = 'Finalizado';
            if (estadosMap[st] !== undefined) estadosMap[st]++;

            const progress = calculateProgress(i.inicio, i.fin);
            const status = getSemaforoStatus(progress);
            semaforoMap[status]++;
        });

        const byType = Object.entries(filteredData.reduce((acc: any, curr) => {
            acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
            return acc;
        }, {})).map(([name, value]) => ({ name, value: Number(value) })).sort((a, b) => b.value - a.value);

        const byEje = AXIS_ORDER.map(eje => ({
            name: eje, shortName: eje.split(' ')[0], count: filteredData.filter(i => i.eje === eje).length
        }));

        return { total, conSeguimiento, sinSeguimiento, cobertura, estadosMap, semaforoMap, byType, byEje };
    }, [filteredData]);

    const groupedData = useMemo(() => {
        const groups: Record<string, Instrumento[]> = {};
        AXIS_ORDER.forEach(axis => groups[axis] = []);
        filteredData.forEach(item => { if (groups[item.eje]) groups[item.eje].push(item); });
        return groups;
    }, [filteredData]);

    if (isLoadingData) return <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium">Sincronizando Sistema de Planeación...</p>
    </div>;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
            <div className="sticky top-0 z-[60]">
                <Navbar activeSection={activeSection} setActiveSection={(s) => setActiveSection(s as any)} onDashboardAction={handleGoToDashboard} />
            </div>

            {activeSection === 'home' ? (
                <>
                    <main className="flex-1">
                        <HomeView stats={stats} onAction={handleGoToDashboard} />
                    </main>
                    <Footer activeSection={activeSection} setActiveSection={(s) => setActiveSection(s as any)} onDashboardAction={handleGoToDashboard} />
                </>
            ) : (
                <div className="flex flex-1 overflow-hidden h-[calc(100vh-73px)] relative bg-slate-100">
                    <Sidebar 
                        currentView={currentView} setCurrentView={(view) => setCurrentView(view as any)} 
                        instrumentsCount={instrumentsData.length} userRole={userRole} 
                        isAuthenticated={isAuthenticated} handleLogout={() => { setIsAuthenticated(false); setUserRole('usuario'); }}
                        isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} isLocal={isLocalMode}
                    />
                    <div className={`flex-1 flex flex-col min-w-0 h-full relative overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-48' : 'ml-0'}`}>
                        <Header 
                            currentView={currentView} searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
                            filterEje={filterEje} setFilterEje={setFilterEje} 
                            onExport={() => {}} onImport={() => {}} userRole={userRole} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                        />
                        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar bg-slate-50/50">
                            {currentView === 'analitica' && <div className="p-4 md:p-6"><AnalyticsView stats={stats} /></div>}
                            {currentView === 'ecosistema' && (
                                <div className="p-4 md:p-6">
                                    <EcosystemView 
                                        groupedData={groupedData} userRole={userRole} 
                                        openCreateModal={() => { setSelectedInstrument({ id: 0, nombre: '', tipo: 'Plan', eje: 'Transversal', inicio: 2024, fin: 2027, temporalidad: '4', estado: 'En proyecto', seguimiento: 'No', observatorio: '' }); setIsCreating(true); }} 
                                        setUserRole={setUserRole} setSelectedInstrument={setSelectedInstrument} 
                                        handleDeleteInstrument={handleDeleteInstrument} onAdminRequest={() => setIsLoginOpen(true)}
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
                instrument={selectedInstrument} onClose={() => { setSelectedInstrument(null); setIsCreating(false); }} 
                role={userRole} onUpdate={handleUpdateInstrument} onCreate={handleCreateInstrument} isCreating={isCreating}
            />
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={(s) => { if(s){ setIsAuthenticated(true); setUserRole('administrador'); setIsLoginOpen(false); }}} />
            <AlertModal isOpen={alertConfig.isOpen} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} />
            <ContactModal isOpen={false} onClose={() => {}} />
            <ChatBot />
        </div>
    );
};

export default App;
