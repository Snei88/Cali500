import React from 'react';
import { CalendarDays, Download, Eye, FilePlus2, FileText, LockKeyhole, Pencil, Trash2 } from 'lucide-react';
import { DocumentRecord, UserRole } from '@/types';
import { CATEGORY_ORDER, STATUS_BORDER_COLORS, STATUS_COLORS } from '@/utils/constants';
import { getFileDownloadUrl } from '@/services/api';

interface EcosystemViewProps {
  groupedData: Record<string, DocumentRecord[]>;
  userRole: UserRole;
  openCreateModal: () => void;
  setSelectedInstrument: (inst: DocumentRecord) => void;
  handleDeleteInstrument: (doc: DocumentRecord, e: React.MouseEvent) => void;
}

const Metric = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="px-6 py-4 text-center">
    <strong className="font-dashboard-title block text-3xl leading-none" style={{ color }}>{value}</strong>
    <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</span>
  </div>
);

const CATEGORY_COLORS: Record<string, { color: string; light: string; border: string }> = {
  'Plan estrategico': { color: '#3A0D7B', light: 'bg-[#3A0D7B]/8', border: 'border-[#3A0D7B]/20' },
  'Politica publica': { color: '#F52789', light: 'bg-[#F52789]/8', border: 'border-[#F52789]/20' },
  'Plan': { color: '#00A7C8', light: 'bg-[#00A7C8]/8', border: 'border-[#00A7C8]/20' },
  'Decreto': { color: '#7CB342', light: 'bg-[#7CB342]/8', border: 'border-[#7CB342]/20' },
  'Resolucion': { color: '#F46217', light: 'bg-[#F46217]/8', border: 'border-[#F46217]/20' },
  'Acuerdo': { color: '#1E88E5', light: 'bg-[#1E88E5]/8', border: 'border-[#1E88E5]/20' },
};

const getCategoryStyle = (category: string) =>
  CATEGORY_COLORS[category] ?? { color: '#3A0D7B', light: 'bg-[#3A0D7B]/8', border: 'border-[#3A0D7B]/20' };

export const EcosystemView: React.FC<EcosystemViewProps> = ({
  groupedData,
  userRole,
  openCreateModal,
  setSelectedInstrument,
  handleDeleteInstrument
}) => {
  const allDocuments = CATEGORY_ORDER.flatMap((category) => groupedData[category] ?? []);
  const publicCount = allDocuments.filter((item) => item.publico).length;
  const restrictedCount = allDocuments.length - publicCount;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-20">

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-[26px] bg-[#3A0D7B] p-7 shadow-[0_20px_60px_rgba(58,13,123,0.28)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_40%,rgba(0,167,200,0.18),transparent_55%),radial-gradient(circle_at_5%_90%,rgba(245,39,137,0.14),transparent_50%)]" />
        <img src="assets/fondo.png" alt="" aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-5" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#A7DFFF]">Planeacion LP</p>
            <h1 className="font-dashboard-title mt-3 max-w-2xl text-3xl leading-tight text-white md:text-4xl">
              Base de instrumentos de largo plazo
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/75">
              Consulta publica y administracion de instrumentos con vigencia, categoria, eje responsable y seguimiento.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-4 sm:flex-row sm:items-center xl:items-end">
            {/* Metrics chip */}
            <div className="flex overflow-hidden rounded-[16px] border border-white/20 bg-white/10 backdrop-blur-sm divide-x divide-white/20">
              <Metric value={allDocuments.length} label="Registros" color="#A7DFFF" />
              <Metric value={publicCount} label="Públicos" color="#A7DFFF" />
              <Metric value={restrictedCount} label="Restringidos" color="#F46217" />
            </div>
            {userRole === 'administrador' && (
              <button
                onClick={openCreateModal}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#F46217] px-6 text-sm font-black text-white shadow-lg transition hover:bg-white hover:text-[#3A0D7B]"
              >
                <FilePlus2 className="h-4 w-4" />
                Registrar documento
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category sections */}
      {CATEGORY_ORDER.map((category) => {
        const items = groupedData[category] ?? [];
        if (items.length === 0) return null;
        const style = getCategoryStyle(category);

        return (
          <section key={category} className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.07)]">
            {/* Category header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full" style={{ backgroundColor: style.color }} />
                <div>
                  <h2 className="font-dashboard-title text-xl leading-tight text-[#0B1F3A]">{category}</h2>
                  <p className="text-sm font-semibold text-slate-500">{items.length} documento(s) en esta categoría</p>
                </div>
              </div>
              <span
                className={`rounded-[10px] border px-3.5 py-1.5 text-xs font-black ${style.light} ${style.border}`}
                style={{ color: style.color }}
              >
                {items.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const downloadUrl = getFileDownloadUrl(item);
                return (
                  <article
                    key={item.id}
                    onClick={() => setSelectedInstrument(item)}
                    className={`grid cursor-pointer gap-4 border-l-4 px-6 py-5 transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-transparent lg:grid-cols-[1fr_180px_160px_180px] lg:items-center ${STATUS_BORDER_COLORS[item.estado] ?? 'border-l-slate-200'}`}
                  >
                    {/* Document info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${STATUS_COLORS[item.estado] ?? STATUS_COLORS.Publicado}`}>
                          {item.estado}
                        </span>
                        {!item.publico && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                            <LockKeyhole className="h-3.5 w-3.5" />
                            Restringido
                          </span>
                        )}
                      </div>
                      <h3 className="font-dashboard-title mt-2 line-clamp-2 text-lg leading-snug text-[#0B1F3A]">{item.nombre}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                        {item.descripcion || 'Documento registrado en el repositorio institucional.'}
                      </p>
                    </div>

                    {/* Entity */}
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Entidad</span>
                      <span className="mt-1 block text-sm font-semibold leading-5 text-slate-700">{item.entidad}</span>
                    </div>

                    {/* Vigencia */}
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Vigencia</span>
                      <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <CalendarDays className="h-4 w-4 shrink-0 text-[#3A0D7B]" />
                        {item.vigencia}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedInstrument(item)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:border-[#3A0D7B]/30 hover:bg-[#3A0D7B]/5 hover:text-[#3A0D7B]"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </button>
                      {downloadUrl && (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#7CB342]/30 bg-[#7CB342]/10 text-[#7CB342] transition hover:bg-[#7CB342] hover:text-white"
                          aria-label="Descargar documento"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                      {userRole === 'administrador' && (
                        <>
                          <button
                            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#00A7C8]/30 bg-[#00A7C8]/10 text-[#00A7C8] transition hover:bg-[#00A7C8] hover:text-white"
                            aria-label="Editar documento"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteInstrument(item, e)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#F52789]/30 bg-[#F52789]/10 text-[#F52789] transition hover:bg-[#F52789] hover:text-white"
                            aria-label="Eliminar documento"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Empty state */}
      {allDocuments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3A0D7B]/8">
            <FileText className="h-8 w-8 text-[#3A0D7B]/50" />
          </div>
          <h3 className="font-dashboard-title mt-5 text-2xl text-[#0B1F3A]">No hay documentos para mostrar</h3>
          <p className="mt-3 max-w-sm text-sm font-semibold text-slate-500">
            Ajuste los filtros o cargue registros desde la vista administrativa.
          </p>
        </div>
      )}
    </div>
  );
};
