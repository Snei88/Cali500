import React from 'react';
import { BarChart3, Database, Download, FileStack, Filter, Search } from 'lucide-react';
import { CATEGORY_ORDER } from '@/utils/constants';

interface HeaderProps {
  currentView: 'analitica' | 'documentos' | 'datos';
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterEje: string;
  setFilterEje: (eje: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userRole: string;
  setCurrentView: (view: 'analitica' | 'documentos' | 'datos') => void;
}

const titles = {
  analitica: 'Gobernanza',
  documentos: 'Proyecto LP',
  datos: 'Planeacion LP'
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchTerm,
  setSearchTerm,
  filterEje,
  setFilterEje,
  onExport,
  setCurrentView
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-20 flex shrink-0 flex-col gap-2 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">Cali 500+</p>
          <h1 className="font-dashboard-title text-base text-[#0B1F3A] md:text-lg">{titles[currentView]}</h1>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 md:hidden">
          {[
            { id: 'analitica', icon: BarChart3, label: 'Gobernanza' },
            { id: 'documentos', icon: FileStack, label: 'Proyecto LP' },
            { id: 'datos', icon: Database, label: 'Planeacion LP' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as 'analitica' | 'documentos' | 'datos')}
              className={`flex h-10 min-w-max shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold ${currentView === item.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-700'}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <label className="relative w-full md:w-80">
          <span className="sr-only">Buscar documentos</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por documento, entidad o vigencia"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Filtrar categoria</span>
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white pl-10 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 md:w-56"
            value={filterEje}
            onChange={(event) => setFilterEje(event.target.value)}
          >
            <option value="Todos">Todas las categorías</option>
            {CATEGORY_ORDER.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>

        <button onClick={onExport} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>
    </header>
  );
};
