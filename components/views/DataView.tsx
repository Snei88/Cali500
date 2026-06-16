import React from 'react';
import { CalendarDays, Database, Download, FileText, Globe2, LockKeyhole } from 'lucide-react';
import { DocumentRecord } from '@/types';
import { STATUS_COLORS } from '@/utils/constants';
import { getFileDownloadUrl } from '@/services/api';

interface DataViewProps {
  instruments: DocumentRecord[];
  onSelect: (inst: DocumentRecord) => void;
}

export const DataView: React.FC<DataViewProps> = ({ instruments, onSelect }) => {
  const publicCount = instruments.filter((doc) => doc.publico).length;
  const fileCount = instruments.filter((doc) => getFileDownloadUrl(doc)).length;
  const activeCount = instruments.filter((doc) => !['Vencido', 'Archivado'].includes(doc.estado)).length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 pb-10">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#3A0D7B]">
              <Database className="h-4 w-4" />
              Planeacion LP
            </div>
            <h1 className="font-dashboard-title mt-1 text-2xl leading-tight text-[#0B1F3A] md:text-3xl">
              Base maestra de instrumentos
            </h1>
            <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-slate-600">
              Consulta operativa de metadatos, vigencias, responsables, publicacion y disponibilidad de archivos.
            </p>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 lg:min-w-[390px]">
            {[
              { label: 'Registros', value: instruments.length },
              { label: 'Publicos', value: publicCount },
              { label: 'Archivos', value: fileCount }
            ].map((item) => (
              <div key={item.label} className="border-r border-slate-200 px-4 py-3 text-center last:border-r-0">
                <strong className="font-dashboard-title block text-xl leading-none text-[#0B1F3A]">{item.value}</strong>
                <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-8 items-center gap-2 rounded-lg bg-[#3A0D7B]/8 px-3 text-xs font-black text-[#3A0D7B]">
              <Globe2 className="h-3.5 w-3.5" />
              {publicCount} visibles
            </span>
            <span className="inline-flex h-8 items-center gap-2 rounded-lg bg-[#17A773]/10 px-3 text-xs font-black text-[#137B58]">
              <CalendarDays className="h-3.5 w-3.5" />
              {activeCount} activos
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">Fuente: PostgreSQL local · Cali 500+</span>
        </div>

        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-[1240px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-[#0B1F3A] text-white">
                {['Documento', 'Categoria', 'Vigencia', 'Fecha', 'Estado', 'Entidad', 'Acceso', 'Archivo'].map((header) => (
                  <th key={header} className="px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em]">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {instruments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-sm font-semibold text-slate-500">
                    No se encontraron documentos con los filtros actuales.
                  </td>
                </tr>
              ) : instruments.map((doc) => {
                const downloadUrl = getFileDownloadUrl(doc);
                return (
                  <tr key={doc.id} onClick={() => onSelect(doc)} className="cursor-pointer transition hover:bg-slate-50">
                    <td className="max-w-[430px] px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg border border-[#3A0D7B]/15 bg-[#3A0D7B]/8 p-2 text-[#3A0D7B]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-extrabold leading-snug text-[#0B1F3A]">{doc.nombre}</p>
                          <p className="mt-1 truncate text-xs font-medium text-slate-500">
                            {doc.descripcion || 'Sin descripcion registrada'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">{doc.categoria}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-700">{doc.vigencia}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-600">{doc.fecha?.slice(0, 10)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${STATUS_COLORS[doc.estado] ?? STATUS_COLORS.Publicado}`}>{doc.estado}</span>
                    </td>
                    <td className="max-w-[220px] px-5 py-4 text-sm font-semibold text-slate-700">
                      <span className="line-clamp-2">{doc.entidad}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-black ${doc.publico ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {doc.publico ? <Globe2 className="h-3.5 w-3.5" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                        {doc.publico ? 'Publico' : 'Restringido'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {downloadUrl ? (
                        <a href={downloadUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0B1F3A] px-3 text-xs font-black text-white transition hover:bg-[#3A0D7B]">
                          <Download className="h-4 w-4" />
                          Descargar
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Sin archivo</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-500">
          <span>{instruments.length} registro(s) visibles</span>
          <span>{fileCount} con archivo disponible</span>
        </div>
      </div>
    </div>
  );
};
