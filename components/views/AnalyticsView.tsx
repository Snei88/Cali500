
import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, Activity, Lightbulb, BarChart3, Target, PieChart, ScanSearch } from 'lucide-react';
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
        <div className="space-y-6 max-w-[1600px] mx-auto fade-in">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KpiCard title="Total Instrumentos" value={stats.total} icon={<FileText className="h-8 w-8 mx-auto text-slate-300" />} />
                <KpiCard title="Con Seguimiento" value={stats.conSeguimiento} icon={<CheckCircle2 className="h-8 w-8 mx-auto text-emerald-300" />} />
                <KpiCard title="Sin Seguimiento" value={stats.sinSeguimiento} icon={<AlertTriangle className="h-8 w-8 mx-auto text-rose-300" />} />
                <KpiCard title="Cobertura Seguimiento" value={`${stats.cobertura}%`} icon={<Activity className="h-8 w-8 mx-auto text-indigo-300" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart: By Type */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: CALI.MORADO }}>
                        <BarChart3 className="h-5 w-5" />
                        Distribución por Tipo de Documento
                    </h3>
                    <div className="flex-1 w-full min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.byType} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {stats.byType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart: By Axis */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: CALI.MORADO }}>
                        <Target className="h-5 w-5" />
                        Distribución por Eje Estratégico
                    </h3>
                    <div className="flex-1 w-full min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.byEje} margin={{ top: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="shortName" tick={false} axisLine={false} />
                                <YAxis />
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="count" fill={CALI.TURQUESA} radius={[4, 4, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-around text-[10px] text-slate-400 mt-2 font-medium text-center">
                        <span>Bienestar</span>
                        <span>Territorio</span>
                        <span>Competitividad</span>
                        <span>Transv.</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: CALI.MORADO }}>
                    <CheckCircle2 className="h-5 w-5" />
                    Distribución por Estado
                </h3>
                <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1">
                    <StatusBox label="Permanente" count={stats.estadosMap['Permanente']} colorCode={CALI.VERDE} bgGradient="linear-gradient(135deg, #f0f9e8, #ffffff)" />
                    <StatusBox label="En Ejecución" count={stats.estadosMap['En Ejecución']} colorCode={CALI.TURQUESA} bgGradient="linear-gradient(135deg, #e0f7f5, #ffffff)" />
                    <StatusBox label="En Actualización" count={stats.estadosMap['En Actualización']} colorCode={CALI.AMARILLO} bgGradient="linear-gradient(135deg, #fff9e6, #ffffff)" />
                    <StatusBox label="Finalizado" count={stats.estadosMap['Finalizado']} colorCode={CALI.ROSA} bgGradient="linear-gradient(135deg, #ffe8f0, #ffffff)" />
                </div>
            </div>

             {/* Pie Chart: Seguimiento */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: CALI.MORADO }}>
                    <PieChart className="h-5 w-5" />
                    Seguimiento
                </h3>
                <div className="flex-1 relative w-full min-w-0 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie
                                data={[
                                    { name: 'Con Seguimiento', value: stats.conSeguimiento },
                                    { name: 'Sin Seguimiento', value: stats.sinSeguimiento }
                                ]}
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                <Cell fill={CALI.VERDE} />
                                <Cell fill={CALI.ROSA} />
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Analysis Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold mb-6 pb-2 border-b-4 flex items-center gap-2" style={{ color: CALI.MORADO, borderColor: CALI.MORADO }}>
                    <ScanSearch className="h-6 w-6" />
                    Análisis Ejecutivo y Hallazgos Clave
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnalysisBox 
                        type="critico" 
                        title="HALLAZGOS CRÍTICOS" 
                        items={[
                            `<strong>${stats.total > 0 ? ((stats.sinSeguimiento / stats.total) * 100).toFixed(1) : 0}% sin seguimiento:</strong> ${stats.sinSeguimiento} instrumentos carecen de sistema de monitoreo.`,
                            `<strong>${stats.estadosMap['En Actualización']} instrumentos en actualización:</strong> Requieren atención prioritaria (ej: POT y Marco Fiscal).`,
                            `<strong>${stats.estadosMap['Finalizado']} instrumentos finalizados:</strong> Requieren actualización urgente o cierre.`
                        ]} 
                    />
                    <AnalysisBox 
                        type="alerta" 
                        title="CONCENTRACIÓN Y RETOS DE ARTICULACIÓN" 
                        items={[
                            "<strong>Alta concentración en Bienestar:</strong> La mayoría de los instrumentos están enfocados en el eje de Bienestar Intercultural.",
                            "<strong>Reto de Competitividad:</strong> Menor número de instrumentos dedicados específicamente al eje de Competitividad Sostenible.",
                            "<strong>Articulación POAI:</strong> El reto es lograr que los proyectos y estrategias queden incluidos en el presupuesto de cada vigencia."
                        ]} 
                    />
                    <AnalysisBox 
                        type="oportunidad" 
                        title="FORTALEZAS IDENTIFICADAS" 
                        items={[
                            `<strong>${stats.cobertura}% con seguimiento:</strong> ${stats.conSeguimiento} instrumentos cuentan con monitoreo.`,
                            `<strong>${stats.estadosMap['En Ejecución']} en ejecución activa:</strong> Mayoría operativa según cronograma.`,
                            "<strong>Visión de largo plazo:</strong> Múltiples instrumentos alineados a la visión 2036/2050."
                        ]} 
                    />
                    <div className="p-4 rounded-md border-l-4 bg-slate-50" style={{ borderLeftColor: CALI.TURQUESA, backgroundColor: '#f0fdf4' }}>
                        <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: CALI.MORADO }}>
                            <Target className="h-4 w-4" style={{ color: '#0f766e' }} />
                            RECOMENDACIONES PARA LA ARTICULACIÓN
                        </h4>
                        <ul className="space-y-2">
                            <li className="text-xs text-slate-700 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400"><strong>Sistema integrado de seguimiento:</strong> Implementar monitoreo en los instrumentos faltantes.</li>
                            <li className="text-xs text-slate-700 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400"><strong>Coordinación de actualizaciones:</strong> Los instrumentos en actualización deben guardar coherencia entre sí.</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-6 p-4 rounded-lg text-white text-sm font-medium text-center leading-relaxed shadow-md" style={{ background: `linear-gradient(135deg, ${CALI.MORADO}, ${CALI.TURQUESA})` }}>
                    <Lightbulb className="inline h-4 w-4 mr-2 mb-0.5" />
                    <strong>INSIGHT CLAVE:</strong> La Visión Cali 500+ requiere que la planificación se articule para que estrategias, acciones y proyectos estén alineados. El Seguimiento de los diferentes instrumentos debe ser integral y permitir que los Planes Trasciendan los periodos de gobierno.
                </div>
            </div>
        </div>
    );
};
