import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  FilePlus2,
  FileUp,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Pencil,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X
} from 'lucide-react';
import { PlanningInstrument } from '@/types';
import {
  deletePlanningInstrument,
  getAdminSession,
  getAllPlanningInstruments,
  getPlanningInstrumentValidationErrors,
  savePlanningInstrument,
  signInAdmin,
  signOutAdmin,
  uploadDocumentFile
} from '@/services/api';
import { VISION_IMAGE_URL } from '@/utils/constants';

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`.replace(/\/+/g, '/');

const emptyInstrument = (): PlanningInstrument => ({
  id: 'nuevo',
  nombre: '',
  tipo: '',
  eje: '',
  fecha_inicio: '',
  fecha_fin: '',
  estado: 'En Ejecucion',
  link: '',
  enlace_web: '',
  documento_url: '',
  observatorio: '',
  visible: false,
  validacion_errores: [],
  origen: 'admin'
});

const Field = ({
  label,
  children,
  required = false
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="space-y-1.5">
    <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
      {label}{required ? ' *' : ''}
    </span>
    {children}
  </label>
);

const inputClass = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#3A0D7B] focus:ring-4 focus:ring-[#3A0D7B]/10';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('Todos');
  const [instruments, setInstruments] = useState<PlanningInstrument[]>([]);
  const [selected, setSelected] = useState<PlanningInstrument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = document.getElementById('root');
    const previousZoom = root?.style.zoom;
    const previousWidth = root?.style.width;
    if (root) {
      root.style.zoom = '1';
      root.style.width = '100%';
    }

    return () => {
      if (root) {
        root.style.zoom = previousZoom ?? '';
        root.style.width = previousWidth ?? '';
      }
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    const result = await getAllPlanningInstruments();
    setInstruments(result.data);
    if (result.error) setError(result.error);
    setIsLoading(false);
  };

  useEffect(() => {
    const boot = async () => {
      const session = await getAdminSession();
      const authed = Boolean(session);
      setIsAuthenticated(authed);
      setIsBooting(false);
      if (authed) loadData();
    };
    boot();
  }, []);

  const stats = useMemo(() => {
    const valid = instruments.filter((item) => (item.validacion_errores ?? []).length === 0);
    return {
      total: instruments.length,
      visibles: instruments.filter((item) => item.visible).length,
      ocultos: instruments.filter((item) => !item.visible).length,
      pendientes: instruments.length - valid.length
    };
  }, [instruments]);

  const states = useMemo(() => {
    const unique = new Set(instruments.map((item) => item.estado).filter(Boolean));
    return ['Todos', ...Array.from(unique).sort()];
  }, [instruments]);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return instruments.filter((item) => {
      const haystack = `${item.nombre} ${item.tipo} ${item.eje} ${item.estado} ${item.link} ${item.enlace_web}`.toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesState = filterState === 'Todos' || item.estado === filterState;
      return matchesSearch && matchesState;
    });
  }, [filterState, instruments, searchTerm]);

  const validationErrors = selected ? getPlanningInstrumentValidationErrors(selected) : [];
  const canPublish = validationErrors.length === 0;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await signInAdmin(loginEmail, loginPassword);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error ?? 'No se pudo iniciar sesion.');
      return;
    }
    setIsAuthenticated(true);
    setLoginPassword('');
    loadData();
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setIsAuthenticated(false);
    setSelected(null);
  };

  const setField = (field: keyof PlanningInstrument, value: unknown) => {
    setSelected((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    if (!selected) return;
    setIsSaving(true);
    setError('');
    setNotice('');
    const result = await savePlanningInstrument(selected);
    setIsSaving(false);
    if (!result.success || !result.data) {
      setError(result.error ?? 'No se pudo guardar el instrumento.');
      return;
    }

    setInstruments((prev) => {
      const exists = prev.some((item) => item.id === result.data!.id);
      return exists ? prev.map((item) => item.id === result.data!.id ? result.data! : item) : [result.data!, ...prev];
    });
    setSelected(result.data);
    setNotice(result.data.visible ? 'Instrumento guardado y publicado.' : 'Instrumento guardado. Permanece oculto hasta cumplir las reglas de publicacion.');
  };

  const handleDelete = async (item: PlanningInstrument) => {
    if (!window.confirm(`Eliminar "${item.nombre}"?`)) return;
    setError('');
    const result = await deletePlanningInstrument(item);
    if (!result.success) {
      setError(result.error ?? 'No se pudo eliminar el instrumento.');
      return;
    }
    setInstruments((prev) => prev.filter((instrument) => instrument.id !== item.id));
    if (selected?.id === item.id) setSelected(null);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      const uploaded = await uploadDocumentFile(file);
      setField('documento_url', uploaded.publicUrl);
      setField('link', uploaded.publicUrl);
    } catch (uploadError: any) {
      setError(uploadError.message ?? 'No se pudo subir el archivo.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  if (isBooting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF3F8] text-[#3A0D7B]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen bg-[#F4F6F8] text-slate-900 lg:grid-cols-2">
        <section className="relative flex min-h-[42vh] overflow-hidden bg-[#211A64] px-6 py-8 text-white sm:px-10 lg:min-h-screen lg:flex-col lg:justify-between lg:px-12 lg:py-10">
          <img src={assetUrl('assets/fondo.png')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.06]" />
          <div className="absolute inset-0 bg-[linear-gradient(155deg,#17114D_0%,#24206C_58%,#332177_100%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between gap-12 lg:h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={assetUrl('assets/logo-ilera.png')}
                  alt="Cali 500+"
                  className="h-12 w-auto max-w-[220px] object-contain"
                />
                <span className="hidden h-8 w-px bg-white/20 sm:block" />
                <p className="hidden max-w-[190px] text-[10px] font-bold uppercase leading-4 tracking-[0.16em] text-white/70 sm:block">
                  Sistema de inteligencia institucional
                </p>
              </div>
            </div>

            <div className="max-w-xl lg:pb-12">
              <h1 className="font-anton max-w-[520px] text-[40px] uppercase leading-[0.98] tracking-normal text-white drop-shadow-sm sm:text-5xl lg:text-[54px]">
                Control privado de instrumentos de planeacion.
              </h1>
              <p className="mt-5 text-sm font-bold text-[#FFB38A]">
                Gestion Institucional
              </p>

              <div className="mt-7 grid gap-4">
                {[
                  'Validacion antes de publicar',
                  'Datos conectados al dashboard',
                  'Base lista para sincronizar Google Sheets'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold text-white">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FF761A] text-white">
                      <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-3 border-l-2 border-[#FF761A] pl-5 text-sm font-semibold text-white/65 lg:flex">
              Acceso restringido a usuarios autorizados
            </div>
          </div>
        </section>

        <section className="flex min-h-[58vh] flex-col items-center justify-center bg-[#F4F6F8] px-6 py-10 lg:min-h-screen">
          <form onSubmit={handleLogin} className="w-full max-w-[420px]">
            <div className="rounded-xl border border-slate-200 bg-white px-8 py-9 shadow-[0_18px_52px_rgba(15,23,42,0.10)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F0F8] text-[#27206D]">
                <Lock className="h-6 w-6" />
              </div>

              <div className="mt-5 text-center">
                <h1 className="font-sans text-base font-extrabold leading-tight tracking-normal text-[#1F163D]">
                  Iniciar sesion
                </h1>
                <p className="mx-auto mt-3 max-w-[280px] text-xs font-medium leading-5 text-slate-600">
                  Use el correo autorizado para gestionar instrumentos y documentos.
                </p>
              </div>

              {error && (
                <div className="mt-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="mt-7 space-y-5">
                <Field label="Correo institucional" required>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B516E]" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                      className="h-11 w-full rounded-lg border border-[#D7BBAA] bg-[#F6F7F8] pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#FF761A] focus:bg-white focus:ring-4 focus:ring-[#FF761A]/10"
                      autoComplete="email"
                      placeholder="nombre@cali.gov.co"
                      required
                    />
                  </div>
                </Field>

                <Field label="Contrasena" required>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B516E]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      className="h-11 w-full rounded-lg border border-[#D7BBAA] bg-[#F6F7F8] pl-11 pr-12 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#FF761A] focus:bg-white focus:ring-4 focus:ring-[#FF761A]/10"
                      autoComplete="current-password"
                      placeholder="Ingrese su contrasena"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[#5B516E] transition hover:bg-slate-100 hover:text-[#211A64]"
                      aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                <button disabled={isLoading} className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-[#FF761A] text-xs font-black uppercase tracking-[0.08em] text-[#241347] shadow-[0_12px_24px_rgba(255,118,26,0.28)] transition hover:bg-[#F46217] disabled:cursor-not-allowed disabled:opacity-60">
                  {isLoading ? 'Validando acceso...' : 'Entrar al panel'}
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4 rotate-180" />}
                </button>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-5">
                <p className="flex gap-3 text-xs font-medium leading-5 text-slate-600">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#211A64]" />
                  Si no tiene acceso, cree o active el usuario en la base local antes de intentar ingresar.
                </p>
              </div>
            </div>

            <nav className="mt-7 flex justify-center gap-8 text-xs font-semibold uppercase tracking-[0.08em] text-[#3C2A43]">
              <a href="#" onClick={(event) => event.preventDefault()} className="hover:text-[#FF761A]">Privacidad</a>
              <a href="#" onClick={(event) => event.preventDefault()} className="hover:text-[#FF761A]">Terminos</a>
              <a href="#" onClick={(event) => event.preventDefault()} className="hover:text-[#FF761A]">Soporte</a>
            </nav>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EEF3F8] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <img src={assetUrl(VISION_IMAGE_URL)} alt="Cali 500+" className="h-11 w-11 rounded-full border border-slate-200 object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#3A0D7B]">Cali 500+ Admin</p>
              <p className="truncate text-xs font-bold uppercase tracking-[0.12em] text-[#F46217]">Instrumentos de planeacion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadData} disabled={isLoading} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button onClick={handleLogout} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0B1F3A] px-3 text-sm font-bold text-white transition hover:bg-[#3A0D7B]">
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-5 py-6 xl:grid-cols-[minmax(0,1fr)_460px]">
        <section className="min-w-0 space-y-5">
          <div className="rounded-[24px] bg-[#3A0D7B] p-6 text-white shadow-[0_20px_60px_rgba(58,13,123,0.18)]">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">Modulo independiente</p>
                <h1 className="font-anton mt-3 text-3xl leading-tight md:text-4xl">Gestion de instrumentos y publicacion.</h1>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/75">
                  Los registros solo se publican cuando los campos requeridos estan completos y el estado permite visibilidad.
                </p>
              </div>
              <button onClick={() => setSelected(emptyInstrument())} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F46217] px-5 text-sm font-black text-white transition hover:bg-white hover:text-[#3A0D7B]">
                <FilePlus2 className="h-4 w-4" />
                Nuevo instrumento
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total', value: stats.total, icon: LayoutDashboard, color: '#3A0D7B' },
              { label: 'Publicados', value: stats.visibles, icon: Eye, color: '#17A773' },
              { label: 'Ocultos', value: stats.ocultos, icon: EyeOff, color: '#F46217' },
              { label: 'Pendientes', value: stats.pendientes, icon: AlertCircle, color: '#F52789' }
            ].map((item) => (
              <article key={item.label} className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <strong className="font-anton mt-3 block text-3xl leading-none" style={{ color: item.color }}>{item.value}</strong>
              </article>
            ))}
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <label className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar por nombre, tipo, eje, link o estado" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-[#3A0D7B] focus:bg-white focus:ring-4 focus:ring-[#3A0D7B]/10" />
              </label>
              <select value={filterState} onChange={(event) => setFilterState(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-[#3A0D7B] focus:ring-4 focus:ring-[#3A0D7B]/10 md:w-64">
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
          </div>

          {(error || notice) && (
            <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
              {error ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              {error || notice}
            </div>
          )}

          <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Instrumento</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Eje</th>
                    <th className="px-4 py-3">Vigencia</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Publicacion</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => {
                    const itemErrors = item.validacion_errores ?? [];
                    return (
                      <tr key={item.id} className="transition hover:bg-slate-50">
                        <td className="max-w-[330px] px-4 py-4">
                          <p className="line-clamp-2 text-sm font-black text-[#0B1F3A]">{item.nombre}</p>
                          <p className="mt-1 truncate text-xs font-semibold text-slate-500">{item.enlace_web || item.link || 'Sin enlace'}</p>
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.tipo}</td>
                        <td className="max-w-[220px] px-4 py-4 text-sm font-semibold text-slate-600">{item.eje}</td>
                        <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.fecha_inicio} - {item.fecha_fin}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-700">{item.estado}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ${item.visible ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {item.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            {item.visible ? 'Visible' : itemErrors.length ? 'Pendiente' : 'Oculto'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setSelected(item)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-[#3A0D7B]/30 hover:bg-[#3A0D7B]/5 hover:text-[#3A0D7B]" aria-label="Editar">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(item)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50" aria-label="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-sm font-semibold text-slate-500">
                        No hay instrumentos con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="xl:sticky xl:top-[84px] xl:h-[calc(100vh-104px)]">
          {selected ? (
            <div className="flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.1)]">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[#0B1F3A] p-5 text-white">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">{selected.id === 'nuevo' ? 'Nuevo registro' : `Registro ${selected.id}`}</p>
                  <h2 className="font-anton mt-2 text-2xl leading-tight">{selected.nombre || 'Instrumento sin nombre'}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-white/80 transition hover:bg-white/10" aria-label="Cerrar editor">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-[#F6F8FB] p-5">
                <div className="grid gap-4">
                  <Field label="Nombre" required>
                    <input value={selected.nombre} onChange={(event) => setField('nombre', event.target.value)} className={inputClass} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Tipo" required>
                      <input value={selected.tipo} onChange={(event) => setField('tipo', event.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Estado" required>
                      <input value={selected.estado} onChange={(event) => setField('estado', event.target.value)} className={inputClass} />
                    </Field>
                  </div>
                  <Field label="Eje" required>
                    <input value={selected.eje} onChange={(event) => setField('eje', event.target.value)} className={inputClass} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Inicio" required>
                      <input value={selected.fecha_inicio} onChange={(event) => setField('fecha_inicio', event.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Fin" required>
                      <input value={selected.fecha_fin} onChange={(event) => setField('fecha_fin', event.target.value)} className={inputClass} />
                    </Field>
                  </div>
                  <Field label="Link" required>
                    <input value={selected.link} onChange={(event) => setField('link', event.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Enlace web" required>
                    <input value={selected.enlace_web} onChange={(event) => setField('enlace_web', event.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Observatorio">
                    <input value={selected.observatorio ?? ''} onChange={(event) => setField('observatorio', event.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Documento adjunto">
                    <div className="space-y-2">
                      <input value={selected.documento_url ?? ''} onChange={(event) => setField('documento_url', event.target.value)} className={inputClass} placeholder="URL del documento" />
                      <button disabled={isUploading} onClick={() => fileInputRef.current?.click()} type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#3A0D7B]/20 bg-[#3A0D7B]/5 text-sm font-black text-[#3A0D7B] transition hover:bg-[#3A0D7B]/10 disabled:opacity-60">
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
                        Subir archivo
                      </button>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
                    </div>
                  </Field>
                </div>

                <div className={`rounded-xl border p-4 ${canPublish ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                  <p className="flex items-center gap-2 text-sm font-black">
                    {canPublish ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {canPublish ? 'Listo para publicar' : 'Pendiente de validacion'}
                  </p>
                  {!canPublish && (
                    <ul className="mt-2 space-y-1 text-xs font-semibold">
                      {validationErrors.map((item) => <li key={item}>- {item}</li>)}
                    </ul>
                  )}
                </div>

                <label className={`flex items-center justify-between rounded-xl border px-4 py-3 ${canPublish ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-100 opacity-70'}`}>
                  <span>
                    <span className="block text-sm font-black text-[#0B1F3A]">Publicar en la plataforma</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">Solo se guardara visible si cumple las reglas.</span>
                  </span>
                  <input type="checkbox" checked={Boolean(selected.visible)} disabled={!canPublish} onChange={(event) => setField('visible', event.target.checked)} className="h-5 w-5 accent-[#3A0D7B]" />
                </label>
              </div>

              <div className="border-t border-slate-200 bg-white p-5">
                <button onClick={handleSave} disabled={isSaving || isUploading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F46217] text-sm font-black text-white transition hover:bg-[#3A0D7B] disabled:opacity-60">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Guardar instrumento
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <FilePlus2 className="h-10 w-10 text-slate-300" />
              <h2 className="font-anton mt-4 text-2xl text-[#0B1F3A]">Seleccione un registro</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Edite un instrumento existente o cree uno nuevo desde el boton superior.</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};
