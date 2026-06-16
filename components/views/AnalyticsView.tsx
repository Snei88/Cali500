import React from 'react';
import { Activity, AlertTriangle, Archive, Building2, CheckCircle2, FileClock, FileText, ShieldCheck, TrendingUp } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DocumentRecord, Stats } from '@/types';
import { COLORS, STATUS_COLORS } from '@/utils/constants';

interface AnalyticsViewProps {
  stats: Stats;
  documents: DocumentRecord[];
}

const numberFormat = new Intl.NumberFormat('es-CO');

const kpiConfig = [
  {
    label: 'Registros',
    detail: 'Documentos incluidos en la consulta actual',
    icon: FileText,
    color: '#3A0D7B',
    bg: 'from-[#3A0D7B]/10 to-[#3A0D7B]/5',
    border: 'border-[#3A0D7B]/20',
    iconBg: 'bg-[#3A0D7B]',
    metricKey: 'total' as const,
  },
  {
    label: 'Apertura',
    detail: 'Disponibles para consulta pública',
    icon: ShieldCheck,
    color: '#00A7C8',
    bg: 'from-[#00A7C8]/10 to-[#00A7C8]/5',
    border: 'border-[#00A7C8]/20',
    iconBg: 'bg-[#00A7C8]',
    metricKey: 'publicos' as const,
  },
  {
    label: 'Vigentes',
    detail: 'Documentos con vigencia activa',
    icon: CheckCircle2,
    color: '#7CB342',
    bg: 'from-[#7CB342]/10 to-[#7CB342]/5',
    border: 'border-[#7CB342]/20',
    iconBg: 'bg-[#7CB342]',
    metricKey: 'vigentes' as const,
  },
  {
    label: 'Revisión',
    detail: 'Registros pendientes de validación',
    icon: FileClock,
    color: '#F46217',
    bg: 'from-[#F46217]/10 to-[#F46217]/5',
    border: 'border-[#F46217]/20',
    iconBg: 'bg-[#F46217]',
    metricKey: 'enRevision' as const,
  },
];

const Kpi = ({
  label, value, detail, icon: Icon, color, bg, border, iconBg,
}: {
  label: string; value: string | number; detail: string; icon: React.ElementType;
  color: string; bg: string; border: string; iconBg: string;
}) => (
  <article className={`relative overflow-hidden rounded-[22px] border ${border} bg-gradient-to-br ${bg} bg-white p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(15,23,42,0.12)]`}>
    <span className="absolute right-5 top-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${iconBg} text-white shadow-lg`}>
        <Icon className="h-5 w-5" />
      </div>
    </span>
    <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color }}>{label}</p>
    <strong className="font-dashboard-title mt-3 block text-4xl leading-none text-[#0B1F3A]">{value}</strong>
    <div className="mt-4 h-[2px] w-8 rounded-full" style={{ backgroundColor: color }} />
    <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{detail}</p>
  </article>
);

const Panel = ({ title, description, children, action, accent = '#3A0D7B' }: {
  title: string; description?: string; children: React.ReactNode;
  action?: React.ReactNode; accent?: string;
}) => (
  <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.07)]">
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <div>
          <h2 className="font-dashboard-title text-xl leading-tight text-[#0B1F3A]">{title}</h2>
          {description && <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, documents }) => {
  const recentDocuments = documents.slice(0, 7);
  const riskCount = stats.estadosMap.Vencido ?? 0;
  const activePercent = stats.total ? Math.round(((stats.vigentes + stats.publicados) / stats.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-12">

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-[26px] bg-[#3A0D7B] p-7 shadow-[0_20px_60px_rgba(58,13,123,0.28)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(244,98,23,0.18),transparent_60%),radial-gradient(circle_at_10%_80%,rgba(0,167,200,0.14),transparent_50%)]" />
        <img src="assets/fondo.png" alt="" aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-5" />
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#A7DFFF]">Seguimiento documental</p>
            <h1 className="font-dashboard-title mt-3 max-w-2xl text-3xl leading-tight text-white md:text-4xl">
              Estado institucional del repositorio Cali 500+
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/75">
              Seguimiento de apertura pública, vigencias, entidades responsables y actividad documental.
            </p>
          </div>
          <div className="grid min-w-full grid-cols-3 overflow-hidden rounded-[18px] border border-white/20 bg-white/10 backdrop-blur-sm lg:min-w-[340px]">
            <div className="px-5 py-4 text-center">
              <strong className="font-dashboard-title block text-3xl leading-none text-white">{activePercent}%</strong>
              <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">Activos</span>
            </div>
            <div className="border-x border-white/20 px-5 py-4 text-center">
              <strong className="font-dashboard-title block text-3xl leading-none text-[#A7DFFF]">{stats.cobertura}%</strong>
              <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">Públicos</span>
            </div>
            <div className="px-5 py-4 text-center">
              <strong className="font-dashboard-title block text-3xl leading-none text-[#F46217]">{riskCount}</strong>
              <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">Alertas</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiConfig.map((cfg) => (
          <React.Fragment key={cfg.metricKey}>
            <Kpi
              label={cfg.label}
              value={numberFormat.format(stats[cfg.metricKey] as number)}
              detail={cfg.detail}
              icon={cfg.icon}
              color={cfg.color}
              bg={cfg.bg}
              border={cfg.border}
              iconBg={cfg.iconBg}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Panel
          title="Actividad documental reciente"
          description="Registros creados o fechados durante los últimos seis meses."
          accent="#00A7C8"
          action={<TrendingUp className="h-5 w-5 text-[#00A7C8]" />}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.byMonth} margin={{ left: -12, right: 12 }}>
                <defs>
                  <linearGradient id="activity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3A0D7B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3A0D7B" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #CBD5E1', boxShadow: '0 12px 30px rgba(15,23,42,.08)' }} />
                <Area type="monotone" dataKey="documentos" stroke="#3A0D7B" strokeWidth={3} fill="url(#activity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Distribución por categoría" description="Estado de publicación operativa." accent="#F52789">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.byCategory} innerRadius={54} outerRadius={84} dataKey="value" nameKey="name" paddingAngle={2}>
                  {stats.byCategory.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #CBD5E1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {stats.byCategory.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate text-sm font-semibold text-slate-700">{item.name}</span>
                </div>
                <strong className="shrink-0 text-sm font-black text-[#0B1F3A]">{item.value}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Entidades responsables" description="Organismos con mayor volumen documental registrado." accent="#7CB342">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byEntity} layout="vertical" margin={{ left: 28, right: 16 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={132} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #CBD5E1' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#3A0D7B" barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Últimos registros"
          description="Lectura rápida para seguimiento administrativo."
          accent="#F46217"
          action={<Activity className="h-5 w-5 text-[#F46217]" />}
        >
          <div className="overflow-hidden rounded-[16px] border border-slate-100">
            {recentDocuments.length === 0 ? (
              <div className="flex items-center gap-3 p-6 text-sm text-slate-500">
                <Archive className="h-5 w-5" />
                No hay documentos disponibles con los filtros actuales.
              </div>
            ) : recentDocuments.map((doc) => (
              <div key={doc.id} className="grid gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 transition hover:bg-slate-50/80 md:grid-cols-[1fr_140px_120px] md:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[#0B1F3A]">{doc.nombre}</p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    {doc.entidad}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600">{doc.vigencia}</span>
                <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-bold ${STATUS_COLORS[doc.estado] ?? STATUS_COLORS.Publicado}`}>
                  {doc.estado}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {riskCount > 0 && (
        <div className="flex items-start gap-4 rounded-[18px] border border-[#F46217]/30 bg-gradient-to-r from-[#F46217]/8 to-[#F46217]/5 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F46217] text-white shadow-md">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black text-[#3A0D7B]">Alerta de vigencias</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Hay {riskCount} documento(s) vencido(s). Recomendación: revisar vigencias, responsables y necesidad de actualización normativa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
