
import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, Activity, Lightbulb, BarChart3, Target, PieChart, ScanSearch, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Stats } from '@/types';
import { CALI, COLORS } from '@/utils/constants';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { StatusBox } from '@/components/dashboard/StatusBox';
import { AnalysisBox } from '@/components/dashboard/AnalysisBox';

interface AnalyticsViewProps {
    stats: Stats;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats }) => {
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto fade-in pb-10">
            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KpiCard title="Total Instrumentos" value={stats.total} icon={<FileText className="h-8 w-8 mx-auto text-indigo-400" />} />
                <KpiCard title="Con Seguimiento" value={stats.conSeguimiento} icon={<CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500" />} />
                <KpiCard title="Alertas (Críticos)" value={stats.semaforoMap.critico} icon={<AlertTriangle className="h-8 w-8 mx-auto text-red-500" />} />
                <KpiCard title="Cobertura" value={`${stats.cobertura}%`} icon={<Activity className="h-8 w-8 mx-auto text-indigo-600" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Distribución de Semáforo */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-500">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Estado de Ejecución (Semáforo)
                    </h3>
                    <div className="space-y-4 flex-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                            <span className="text-[10px] font-black uppercase text-red-600">Crítico (0-35%)</span>
                            <span className="text-xl font-black text-red-700">{stats.semaforoMap.critico}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <span className="text-[10px] font-black uppercase text-amber-600">Intermedio (36-70%)</span>
                            <span className="text-xl font-black text-amber-700">{stats.semaforoMap.intermedio}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <span className="text-[10px] font-black uppercase text-emerald-600">Óptimo (71-100%)</span>
                            <span className="text-xl font-black text-emerald-700">{stats.semaforoMap.optimo}</span>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Tipos */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm lg:col-span-2">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-500">
                        <BarChart3 className="h-4 w-4 text-indigo-500" />
                        Distribución por Tipo de Documento
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.byType} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={15}>
                                    {stats.byType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Hallazgos e Insights */}
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]"></div>
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
                    <ScanSearch className="h-6 w-6 text-indigo-400" />
                    Análisis de Cumplimiento
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-400 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Riesgos</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            Se detectan <span className="text-white font-bold">{stats.semaforoMap.critico}</span> instrumentos con avance crítico que requieren revisión presupuestal inmediata para alinearse con el POAI.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Fortalezas</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            El <span className="text-white font-bold">{stats.cobertura}%</span> del ecosistema cuenta con un sistema de monitoreo activo, superando la meta base de trazabilidad distrital.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <Target className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Recomendación</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            Priorizar la actualización de los <span className="text-white font-bold">{stats.estadosMap['En Actualización']}</span> instrumentos para que mantengan coherencia técnica con el nuevo POT.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
