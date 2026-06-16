import React, { useEffect, useRef, useState } from 'react';
import { Download, FileUp, Loader2, Save, Trash2, X } from 'lucide-react';
import { DocumentRecord, UserRole } from '@/types';
import { CATEGORY_ORDER, STATUS_ORDER } from '@/utils/constants';
import { getFileDownloadUrl, uploadDocumentFile } from '@/services/api';

interface InstrumentDrawerProps {
  instrument: DocumentRecord | null;
  onClose: () => void;
  role: UserRole | string;
  onUpdate: (inst: DocumentRecord) => void;
  onCreate: (inst: DocumentRecord) => void;
  isCreating: boolean;
}

export const InstrumentDrawer: React.FC<InstrumentDrawerProps> = ({ instrument, onClose, role, onUpdate, onCreate, isCreating }) => {
  const [editData, setEditData] = useState<DocumentRecord | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditData(instrument);
    setUploadError('');
    setIsUploading(false);
  }, [instrument]);

  if (!editData) return null;

  const isAdmin = role === 'administrador';
  const downloadUrl = getFileDownloadUrl(editData);

  const setField = (field: keyof DocumentRecord, value: any) => {
    setEditData((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    try {
      const uploaded = await uploadDocumentFile(file);
      setEditData((prev) => prev ? {
        ...prev,
        archivo_path: uploaded.path,
        archivo_url: uploaded.publicUrl,
        archivo_nombre: uploaded.fileName
      } : prev);
    } catch (error: any) {
      setUploadError(error.message ?? 'No se pudo subir el archivo.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSave = () => {
    if (!editData.nombre.trim()) {
      setUploadError('El nombre del documento es obligatorio.');
      return;
    }
    if (isCreating) onCreate(editData);
    else onUpdate(editData);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="bg-[#0B1F3A] p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">{isCreating ? 'Nuevo registro documental' : `Registro ${editData.id}`}</p>
              <h2 className="mt-3 text-2xl font-black leading-tight">{editData.nombre || 'Documento sin nombre'}</h2>
            </div>
            <button onClick={onClose} className="rounded-xl p-2 text-white/80 transition hover:bg-white/10" aria-label="Cerrar panel">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto bg-[#F6F8FB] p-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#0B1F3A]">Información del documento</h3>
            <div className="mt-5 grid gap-4">
              <label className="space-y-1.5">
                <span className="text-sm font-bold text-slate-700">Nombre del documento</span>
                {isAdmin ? (
                  <input value={editData.nombre} onChange={(event) => setField('nombre', event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" />
                ) : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{editData.nombre}</p>}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-bold text-slate-700">Vigencia</span>
                  {isAdmin ? <input value={editData.vigencia} onChange={(event) => setField('vigencia', event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" /> : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm">{editData.vigencia}</p>}
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-bold text-slate-700">Fecha</span>
                  {isAdmin ? <input type="date" value={editData.fecha?.slice(0, 10)} onChange={(event) => setField('fecha', event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" /> : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm">{editData.fecha?.slice(0, 10)}</p>}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-bold text-slate-700">Categoria</span>
                  {isAdmin ? (
                    <select value={editData.categoria} onChange={(event) => setField('categoria', event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10">
                      {CATEGORY_ORDER.map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  ) : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm">{editData.categoria}</p>}
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-bold text-slate-700">Estado</span>
                  {isAdmin ? (
                    <select value={editData.estado} onChange={(event) => setField('estado', event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10">
                      {STATUS_ORDER.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  ) : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm">{editData.estado}</p>}
                </label>
              </div>

              <label className="space-y-1.5">
                <span className="text-sm font-bold text-slate-700">Entidad relacionada</span>
                {isAdmin ? <input value={editData.entidad} onChange={(event) => setField('entidad', event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" /> : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm">{editData.entidad}</p>}
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-bold text-slate-700">Descripción y metadatos</span>
                {isAdmin ? <textarea rows={4} value={editData.descripcion ?? ''} onChange={(event) => setField('descripcion', event.target.value)} className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" /> : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6">{editData.descripcion || 'Sin descripción registrada.'}</p>}
              </label>

              {isAdmin && (
                <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-bold text-slate-700">Visible para usuarios públicos</span>
                  <input type="checkbox" checked={editData.publico} onChange={(event) => setField('publico', event.target.checked)} className="h-5 w-5 accent-blue-700" />
                </label>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#0B1F3A]">Archivo asociado</h3>
            {uploadError && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{uploadError}</div>}
            <div className="mt-5 space-y-3">
              {editData.archivo_nombre ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#0B1F3A]">{editData.archivo_nombre}</p>
                    <p className="text-xs text-slate-500">{editData.archivo_path || 'Archivo externo'}</p>
                  </div>
                  <div className="flex gap-2">
                    {downloadUrl && <a href={downloadUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-blue-700 p-2 text-white"><Download className="h-4 w-4" /></a>}
                    {isAdmin && <button onClick={() => setEditData({ ...editData, archivo_nombre: undefined, archivo_path: undefined, archivo_url: undefined })} className="rounded-lg bg-rose-50 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">No hay archivo cargado.</div>
              )}

              {isAdmin && (
                <button disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-100 disabled:opacity-60">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
              {isUploading ? 'Subiendo archivo...' : 'Cargar o reemplazar archivo'}
                </button>
              )}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
            </div>
          </section>
        </div>

        {isAdmin && (
          <div className="border-t border-slate-200 bg-white p-5">
            <button onClick={handleSave} disabled={isUploading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60">
              <Save className="h-4 w-4" />
              {isCreating ? 'Registrar documento' : 'Guardar cambios'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
