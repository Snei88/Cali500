import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, FileStack, Loader2 } from 'lucide-react';
import { DocumentRecord, Stats, UserRole } from './types';
import { CATEGORY_ORDER, STATUS_ORDER } from './utils/constants';
import { deleteDocument, getDocuments, saveDocument } from './services/api';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { EcosystemView } from './components/views/EcosystemView';
import { AdminApp } from './components/admin/AdminApp';
import { InstrumentDrawer } from './components/InstrumentDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { AlertModal } from './components/ui/AlertModal';

type DashboardView = 'analitica' | 'documentos' | 'datos';

const emptyDocument = (): DocumentRecord => ({
  id: 'nuevo',
  nombre: '',
  vigencia: `${new Date().getFullYear()}-${new Date().getFullYear() + 3}`,
  categoria: 'Plan estrategico',
  fecha: new Date().toISOString().slice(0, 10),
  estado: 'Publicado',
  entidad: 'Alcaldia de Santiago de Cali',
  descripcion: '',
  metadatos: {},
  publico: true
});

const App = () => {
  const isAdminApp = window.location.pathname.replace(/\/$/, '').endsWith('/admin')
    || window.location.hostname.startsWith('app.')
    || new URLSearchParams(window.location.search).get('admin') === '1'
    || window.location.hash === '#admin-app';

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeSection, setActiveSection] = useState<'home' | 'dashboard'>('home');
  const [currentView, setCurrentView] = useState<DashboardView>('analitica');
  const [selectedDocument, setSelectedDocument] = useState<DocumentRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [userRole, setUserRole] = useState<UserRole>('usuario');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'success' as 'success' | 'error', title: '', message: '' });

  const loadDocuments = async () => {
    setIsLoadingData(true);
    const result = await getDocuments();
    setDocuments(result.data);
    setLoadError(result.error ?? '');
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (isAdminApp) {
      setIsLoadingData(false);
      return;
    }

    loadDocuments();

    if (window.location.hash === '#admin') {
      setActiveSection('dashboard');
      setCurrentView('documentos');
      setIsLoginOpen(true);
    }
  }, []);

  const showAlert = (type: 'success' | 'error', title: string, message: string) => {
    setAlertConfig({ isOpen: true, type, title, message });
  };

  const handleGoToDashboard = (view: DashboardView) => {
    setActiveSection('dashboard');
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDocument = async (documento: DocumentRecord) => {
    const result = await saveDocument(documento);
    if (!result.success || !result.data) {
      showAlert('error', 'No se pudo guardar', result.error ?? 'Revise la configuracion de Supabase.');
      return;
    }

    setDocuments((prev) => {
      const exists = prev.some((item) => item.id === result.data!.id);
      return exists ? prev.map((item) => item.id === result.data!.id ? result.data! : item) : [result.data!, ...prev];
    });
    setSelectedDocument(null);
    setIsCreating(false);
    showAlert('success', 'Registro actualizado', 'El documento quedo sincronizado con Supabase.');
  };

  const handleDeleteDocument = async (documento: DocumentRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm('Eliminar este documento y su archivo asociado?')) return;

    const result = await deleteDocument(documento);
    if (!result.success) {
      showAlert('error', 'No se pudo eliminar', result.error ?? 'Intente nuevamente.');
      return;
    }
    setDocuments((prev) => prev.filter((item) => item.id !== documento.id));
    showAlert('success', 'Documento eliminado', 'El registro fue retirado de la base documental.');
  };

  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return documents.filter((item) => {
      const searchable = `${item.nombre} ${item.categoria} ${item.entidad} ${item.vigencia} ${item.estado}`.toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const matchesCategory = filterCategory === 'Todos' || item.categoria === filterCategory;
      const publicVisibility = userRole === 'administrador' || item.publico;
      return matchesSearch && matchesCategory && publicVisibility;
    });
  }, [documents, filterCategory, searchTerm, userRole]);

  const stats: Stats = useMemo(() => {
    const total = filteredData.length;
    const publicos = filteredData.filter((item) => item.publico).length;
    const privados = total - publicos;
    const vigentes = filteredData.filter((item) => item.estado === 'Vigente').length;
    const enRevision = filteredData.filter((item) => item.estado === 'En revision').length;
    const publicados = filteredData.filter((item) => item.estado === 'Publicado').length;
    const cobertura = total > 0 ? ((publicos / total) * 100).toFixed(1) : '0';
    const estadosMap = STATUS_ORDER.reduce<Record<string, number>>((acc, status) => {
      acc[status] = filteredData.filter((item) => item.estado === status).length;
      return acc;
    }, {});
    const byCategory = CATEGORY_ORDER.map((category) => ({
      name: category,
      value: filteredData.filter((item) => item.categoria === category).length
    })).filter((item) => item.value > 0);
    const entityCounts = filteredData.reduce<Record<string, number>>((acc, item) => {
      acc[item.entidad] = (acc[item.entidad] ?? 0) + 1;
      return acc;
    }, {});
    const byEntity = Object.entries(entityCounts)
      .map(([name, count]) => ({ name, count: Number(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    const monthFormatter = new Intl.DateTimeFormat('es-CO', { month: 'short' });
    const byMonth = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return {
        name: monthFormatter.format(date).replace('.', ''),
        documentos: filteredData.filter((item) => item.fecha?.slice(0, 7) === key).length
      };
    });

    return {
      total,
      publicos,
      privados,
      vigentes,
      enRevision,
      publicados,
      cobertura,
      byCategory,
      byEntity,
      byMonth,
      estadosMap,
      activity: [
        { label: 'Documentos publicos disponibles', value: String(publicos), tone: 'success' },
        { label: 'Registros en revision tecnica', value: String(enRevision), tone: 'warning' },
        { label: 'Entidades relacionadas', value: String(byEntity.length), tone: 'info' }
      ]
    };
  }, [filteredData]);

  const groupedData = useMemo(() => {
    const groups: Record<string, DocumentRecord[]> = {};
    CATEGORY_ORDER.forEach((category) => { groups[category] = []; });
    filteredData.forEach((item) => {
      if (!groups[item.categoria]) groups[item.categoria] = [];
      groups[item.categoria].push(item);
    });
    return groups;
  }, [filteredData]);

  if (isLoadingData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#F6F8FB] text-[#0B1F3A]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-semibold">Conectando con la base documental institucional...</p>
      </div>
    );
  }

  if (isAdminApp) return <AdminApp />;

  return (
    <div className={`flex min-h-screen flex-col bg-[#F6F8FB] font-sans text-slate-900 ${activeSection === 'dashboard' ? 'pt-[128px] md:pt-[84px]' : ''}`}>
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} onDashboardAction={handleGoToDashboard} />

      {activeSection === 'home' ? (
        <>
          {loadError && (
            <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm font-medium text-amber-800">
              <div className="mx-auto flex max-w-6xl items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Supabase respondio: {loadError}
              </div>
            </div>
          )}
          <main className="flex-1">
            <HomeView stats={stats} onAction={handleGoToDashboard} />
          </main>
          <Footer activeSection={activeSection} setActiveSection={setActiveSection} onDashboardAction={handleGoToDashboard} />
        </>
      ) : (
        <div className="relative flex h-[calc(100dvh-128px)] flex-1 overflow-hidden bg-[#EEF3F8] md:h-[calc(100vh-84px)]">
          <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
            <Header
              currentView={currentView}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterEje={filterCategory}
              setFilterEje={setFilterCategory}
              onExport={() => {}}
              onImport={() => {}}
              userRole={userRole}
              setCurrentView={setCurrentView}
            />
            <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#F6F8FB]">
              {loadError && (
                <div className="mx-4 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Supabase respondio: {loadError}
                </div>
              )}
              {currentView === 'analitica' && <div className="p-4 md:p-6"><AnalyticsView stats={stats} documents={filteredData} /></div>}
              {currentView === 'documentos' && (
                <div className="p-4 md:p-6">
                  <div className="mx-auto flex min-h-[420px] max-w-[1600px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <FileStack className="h-7 w-7" />
                    </div>
                    <h2 className="font-dashboard-title mt-4 text-2xl text-[#0B1F3A]">Proyecto LP esta vacio</h2>
                    <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
                      Los instrumentos y documentos fueron trasladados a Planeacion LP.
                    </p>
                  </div>
                </div>
              )}
              {currentView === 'datos' && (
                <div className="p-4 md:p-6">
                  <EcosystemView
                    groupedData={groupedData}
                    userRole={userRole}
                    openCreateModal={() => { setSelectedDocument(emptyDocument()); setIsCreating(true); }}
                    setSelectedInstrument={setSelectedDocument}
                    handleDeleteInstrument={(idOrDoc, e) => {
                      const doc = typeof idOrDoc === 'object' ? idOrDoc : documents.find((item) => item.id === idOrDoc);
                      if (doc) handleDeleteDocument(doc, e);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <InstrumentDrawer
        instrument={selectedDocument}
        onClose={() => { setSelectedDocument(null); setIsCreating(false); }}
        role={userRole}
        onUpdate={handleSaveDocument}
        onCreate={handleSaveDocument}
        isCreating={isCreating}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(success) => {
          if (success) {
            setIsAuthenticated(true);
            setUserRole('administrador');
            setIsLoginOpen(false);
          }
        }}
      />
      <AlertModal isOpen={alertConfig.isOpen} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} />
    </div>
  );
};

export default App;
