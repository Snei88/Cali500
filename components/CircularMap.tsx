
import React, { useState, useEffect, useMemo } from 'react';
import { CalendarRange, Grid3X3, FileText, Check, Crown, Layers, ChevronRight, Filter, Map as MapIcon } from 'lucide-react';
import { Instrumento } from '@/types';
import { CALI, AXIS_ORDER } from '@/utils/constants';

interface MapNode extends Instrumento {
    x: number;
    y: number;
    color: string;
    horizon: 'corto' | 'mediano' | 'largo';
    visible: boolean;
}

interface CircularMapProps {
    instruments: Instrumento[];
    onSelect: (inst: Instrumento) => void;
}

export const CircularMap: React.FC<CircularMapProps> = ({ instruments, onSelect }) => {
    const [hoveredItem, setHoveredItem] = useState<{ inst: MapNode; x: number; y: number } | null>(null);
    const [hoveredHorizon, setHoveredHorizon] = useState<string | null>(null);
    const [hoveredSector, setHoveredSector] = useState<string | null>(null);
    
    // Mobile Tab State
    const [activeTab, setActiveTab] = useState<'transversales' | 'mapa' | 'filtros'>('mapa');

    // Filtros locales para el mapa
    const [selectedAxes, setSelectedAxes] = useState<string[]>(AXIS_ORDER);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    
    const allTypes = useMemo(() => Array.from(new Set(instruments.map(i => i.tipo))), [instruments]);

    useEffect(() => {
        setSelectedTypes(allTypes);
    }, [allTypes]);

    const toggleAxis = (axis: string) => {
        if (selectedAxes.includes(axis)) {
            setSelectedAxes(selectedAxes.filter(a => a !== axis));
        } else {
            setSelectedAxes([...selectedAxes, axis]);
        }
    };

    const toggleType = (type: string) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    // --- DATA SPLIT ---
    const transversales = useMemo(() => instruments.filter(i => i.eje === 'Transversal'), [instruments]);
    const mapInstruments = useMemo(() => instruments.filter(i => i.eje !== 'Transversal'), [instruments]);

    // Configuration for rings
    const CENTER = { x: 400, y: 400 };
    const RADII = {
        center: 80,
        corto: { min: 120, max: 190, fixed: 180 },
        mediano: { min: 230, max: 300, fixed: 280 },
        largo: { min: 340, max: 410, fixed: 380 }
    };

    // Configuración de Ejes (3 Ejes distribuidos en 360 grados = 120 grados cada uno)
    const AXIS_SECTORS: Record<string, any> = {
        'Bienestar Basado en la Interculturalidad': { 
            start: -Math.PI / 2, // -90 deg
            end: (-Math.PI / 2) + (2 * Math.PI / 3), // -90 + 120 = 30 deg
            color: CALI.MORADO, 
            labelX: 600, labelY: 150, 
            displayName: "BIENESTAR", textColor: "#3b0764" 
        },
        'Territorio Adaptativo e Inteligente': { 
            start: (-Math.PI / 2) + (2 * Math.PI / 3), // 30 deg
            end: (-Math.PI / 2) + (4 * Math.PI / 3), // 150 deg
            color: CALI.TURQUESA, 
            labelX: 400, labelY: 720, 
            displayName: "TERRITORIO INTELIGENTE", textColor: "#0f766e"
        },
        'Competitividad Sostenible': { 
            start: (-Math.PI / 2) + (4 * Math.PI / 3), // 150 deg
            end: -Math.PI / 2 + 2 * Math.PI, // 270 deg (-90)
            color: CALI.AMARILLO, 
            labelX: 200, labelY: 150, 
            displayName: "COMPETITIVIDAD", textColor: "#b45309"
        }
    };

    const nodes = useMemo<MapNode[]>(() => {
        const groups: Record<string, Instrumento[]> = {};
        
        mapInstruments.forEach(inst => {
            let horizon = 'corto';
            const endYear = typeof inst.fin === 'number' ? inst.fin : 9999;
            
            if (endYear <= 2027) horizon = 'corto';
            else if (endYear <= 2036) horizon = 'mediano';
            else horizon = 'largo';

            const key = `${inst.eje}-${horizon}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(inst);
        });

        const newNodes: MapNode[] = [];
        Object.entries(groups).forEach(([key, groupItems]) => {
            const [eje, horizon] = key.split('-');
            const sector = AXIS_SECTORS[eje];
            if (!sector) return;

            const fixedR = (RADII[horizon as 'corto' | 'mediano' | 'largo']).fixed;
            const padding = 0.15; 
            const sectorSpan = (sector.end - sector.start) - (2 * padding);
            const step = sectorSpan / (groupItems.length + 1);

            groupItems.forEach((inst, index) => {
                const angle = sector.start + padding + (step * (index + 1));
                const x = CENTER.x + fixedR * Math.cos(angle);
                const y = CENTER.y + fixedR * Math.sin(angle);
                const color = sector.color;
                
                newNodes.push({
                    ...inst,
                    x,
                    y,
                    color,
                    horizon: horizon as 'corto' | 'mediano' | 'largo',
                    visible: selectedAxes.includes(inst.eje) && selectedTypes.includes(inst.tipo)
                });
            });
        });
        return newNodes;
    }, [mapInstruments, selectedAxes, selectedTypes]);

    return (
        <div className="flex flex-col lg:flex-row h-full bg-slate-50 overflow-hidden relative">
            
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden flex shrink-0 bg-white border-b border-slate-200 shadow-sm z-30 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('transversales')}
                    className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'transversales' ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/50' : 'text-slate-500'}`}
                >
                    <Layers className="h-4 w-4" /> Transversales
                </button>
                <button 
                    onClick={() => setActiveTab('mapa')}
                    className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'mapa' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500'}`}
                >
                    <MapIcon className="h-4 w-4" /> Mapa
                </button>
                <button 
                    onClick={() => setActiveTab('filtros')}
                    className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'filtros' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500'}`}
                >
                    <Filter className="h-4 w-4" /> Filtros
                </button>
            </div>

            {/* Left Panel: Transversales */}
            <div className={`
                bg-white border-r border-slate-200 flex-col shadow-xl z-20 overflow-hidden shrink-0
                ${activeTab === 'transversales' ? 'flex w-full h-full' : 'hidden'} 
                lg:flex lg:w-80
            `}>
                <div className="p-6 bg-rose-50/50 border-b border-rose-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-6 w-6 text-rose-600" />
                        <h2 className="text-xl font-bold text-slate-800">Transversales</h2>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Instrumentos de alto impacto que permean todos los ejes estratégicos.
                    </p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
                    {/* Vision Cali 500+ Card Highlight */}
                    {transversales.filter(t => t.id === 100).map(item => (
                        <div 
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="bg-gradient-to-br from-[#4a1d75] to-[#00C9B7] rounded-xl p-5 text-white shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Crown className="h-12 w-12" />
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold border border-white/10">ID: {item.id}</span>
                                {item.seguimiento === 'Si' && <div className="flex items-center gap-1 text-[10px] font-bold"><Check className="h-3 w-3" /> Seg.</div>}
                            </div>
                            <h3 className="font-extrabold text-lg leading-tight mb-3 relative z-10">{item.nombre}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] bg-white/20 px-2 py-1 rounded flex items-center gap-1">
                                    <CalendarRange className="h-3 w-3" /> {item.inicio} - {typeof item.fin === 'number' ? item.fin : '2050+'}
                                </span>
                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    ))}

                    {/* Other Transversales */}
                    {transversales.filter(t => t.id !== 100).map(item => (
                        <div 
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="bg-white p-4 rounded-xl border-l-4 border-l-rose-500 border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:bg-rose-50/30 group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">ID: {item.id}</span>
                                {item.seguimiento === 'Si' && <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1"><Check className="h-3 w-3" /> Seg.</span>}
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-snug mb-3 group-hover:text-rose-700 transition-colors">{item.nombre}</h4>
                            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
                                <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                                    <CalendarRange className="h-3 w-3" /> 
                                    {item.inicio} - {item.fin}
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             {/* Center Area: Map (Static) */}
            <div className={`
                relative overflow-hidden bg-slate-100 items-center justify-center p-4
                ${activeTab === 'mapa' ? 'flex w-full h-full' : 'hidden'}
                lg:flex lg:flex-1
            `}>
                <div className="relative w-full max-w-[800px] aspect-square bg-white rounded-full shadow-2xl border border-slate-200">
                    <svg viewBox="0 0 800 800" className="w-full h-full font-sans select-none">
                        <defs>
                            <radialGradient id="gradCenterGreen" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#15803d" />
                            </radialGradient>
                            <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background Sectors */}
                        {Object.entries(AXIS_SECTORS).map(([name, sector]: any) => (
                                <path
                                key={name}
                                d={`M 400 400 L ${400 + 400 * Math.cos(sector.start)} ${400 + 400 * Math.sin(sector.start)} A 400 400 0 0 1 ${400 + 400 * Math.cos(sector.end)} ${400 + 400 * Math.sin(sector.end)} Z`}
                                fill={sector.color}
                                opacity={hoveredItem?.inst.eje === name || hoveredSector === name ? 0.08 : 0.02}
                                className="transition-opacity duration-500"
                            />
                        ))}

                        {/* Rings */}
                        <g>
                            <circle cx="400" cy="400" r="180" fill="none" stroke={hoveredItem?.inst.horizon === 'corto' || hoveredHorizon === 'corto' ? CALI.VERDE : "#e2e8f0"} strokeWidth={hoveredItem?.inst.horizon === 'corto' || hoveredHorizon === 'corto' ? 2 : 1} strokeDasharray="4 4" className="transition-all duration-300" />
                            <circle cx="400" cy="400" r="280" fill="none" stroke={hoveredItem?.inst.horizon === 'mediano' || hoveredHorizon === 'mediano' ? CALI.AMARILLO : "#e2e8f0"} strokeWidth={hoveredItem?.inst.horizon === 'mediano' || hoveredHorizon === 'mediano' ? 2 : 1} strokeDasharray="4 4" className="transition-all duration-300" />
                            <circle cx="400" cy="400" r="380" fill="none" stroke={hoveredItem?.inst.horizon === 'largo' || hoveredHorizon === 'largo' ? CALI.TURQUESA : "#e2e8f0"} strokeWidth={hoveredItem?.inst.horizon === 'largo' || hoveredHorizon === 'largo' ? 2 : 1} className="transition-all duration-300 opacity-50" />
                        </g>

                        {/* Axis Labels */}
                        {Object.entries(AXIS_SECTORS).map(([name, sector]: any) => (
                            <g key={name} opacity={hoveredItem?.inst.eje === name || hoveredSector === name ? 1 : 0.6} className="transition-opacity duration-300">
                                <rect x={sector.labelX - 80} y={sector.labelY - 14} width="160" height="28" rx="14" fill="white" stroke={sector.color} strokeWidth="2" className="shadow-sm drop-shadow-sm" />
                                <text x={sector.labelX} y={sector.labelY} fill={sector.textColor} fontSize="10" fontWeight="900" textAnchor="middle" dy=".35em" className="uppercase tracking-widest font-sans">
                                    {sector.displayName}
                                </text>
                            </g>
                        ))}

                        {/* Horizon Labels */}
                        <text x="400" y="210" textAnchor="middle" className="text-[9px] fill-slate-400 font-bold uppercase tracking-widest opacity-70">Corto Plazo</text>
                        <text x="400" y="110" textAnchor="middle" className="text-[9px] fill-slate-400 font-bold uppercase tracking-widest opacity-70">Mediano Plazo</text>
                        <text x="400" y="15" textAnchor="middle" className="text-[9px] fill-slate-400 font-bold uppercase tracking-widest opacity-70">Largo Plazo</text>

                        {/* Center Hub: SANTIAGO DE CALI */}
                        <g filter="url(#glowGreen)">
                            <circle cx="400" cy="400" r="75" fill="white" stroke="#dcfce7" strokeWidth="4" />
                            <circle cx="400" cy="400" r="68" fill="url(#gradCenterGreen)" className="shadow-inner" />
                            <text x="400" y="392" textAnchor="middle" fill="white" fontWeight="800" fontSize="14" letterSpacing="1px">SANTIAGO</text>
                            <text x="400" y="412" textAnchor="middle" fill="white" fontWeight="800" fontSize="18" letterSpacing="1px">DE CALI</text>
                        </g>

                        {/* Instrument Nodes */}
                        {nodes.map((node, i) => {
                            const isHovered = hoveredItem?.inst.id === node.id;
                            const isDimmed = hoveredItem && !isHovered;
                            
                            return (
                                <g 
                                    key={i} 
                                    className={`cursor-pointer transition-all duration-500 ${node.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                    onMouseEnter={() => node.visible && setHoveredItem({ inst: node, x: node.x, y: node.y })}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        node.visible && onSelect(node);
                                    }}
                                    style={{ opacity: isDimmed ? 0.3 : 1 }}
                                >
                                    <circle cx={node.x} cy={node.y} r={isHovered ? 20 : 0} fill={node.color} opacity="0.2" className="transition-all duration-300" />
                                    <circle cx={node.x} cy={node.y} r={isHovered ? 10 : 7} fill={node.color} stroke="white" strokeWidth="2" className="shadow-md transition-all duration-300" />
                                    {isHovered && (
                                            <circle cx={node.x} cy={node.y} r={14} fill="none" stroke={node.color} strokeWidth="1" className="animate-ping opacity-75" />
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Tooltip Card */}
                    {hoveredItem && (
                        <div 
                            className="absolute z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-100 w-72 animate-in fade-in zoom-in-95 duration-200 overflow-hidden pointer-events-none"
                            style={{ 
                                left: hoveredItem.x - 144, // Center tooltip on node x
                                top: hoveredItem.y - 120, // Position above node
                                transformOrigin: 'bottom center'
                            }}
                        >
                            <div className="p-3 pb-0 flex items-center justify-between mb-1">
                                <span className="text-[9px] font-extrabold uppercase tracking-widest py-0.5 px-2 rounded text-white shadow-sm" style={{ backgroundColor: hoveredItem.inst.color }}>
                                    {hoveredItem.inst.horizon === 'corto' ? 'Corto Plazo' : hoveredItem.inst.horizon === 'mediano' ? 'Mediano Plazo' : 'Largo Plazo'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">ID: {hoveredItem.inst.id}</span>
                            </div>
                            <div className="p-4 pt-1">
                                <h4 className="font-bold text-slate-800 text-sm leading-snug mb-2">{hoveredItem.inst.nombre}</h4>
                                <div className="space-y-1 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <CalendarRange className="h-3 w-3 text-slate-400" />
                                        <span>{hoveredItem.inst.inicio} - {hoveredItem.inst.fin}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Filters for Map (Hidden on mobile unless selected) */}
            <div className={`
                bg-white border-l border-slate-200 flex-col shadow-2xl z-20 shrink-0
                ${activeTab === 'filtros' ? 'flex w-full h-full' : 'hidden'}
                lg:flex lg:w-80
            `}>
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <Filter className="h-5 w-5 text-indigo-600" />
                        Filtros Interactivos
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Controla la visualización del mapa y la lista.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Horizon Filter */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <CalendarRange className="h-3 w-3" /> Temporalidad
                        </h3>
                        <div className="space-y-3">
                            {[
                                { id: 'corto', label: 'Corto Plazo (2024-2027)', color: CALI.VERDE },
                                { id: 'mediano', label: 'Mediano Plazo (2028-2036)', color: CALI.AMARILLO },
                                { id: 'largo', label: 'Largo Plazo (2037-2050+)', color: CALI.TURQUESA }
                            ].map(horizon => (
                                <div 
                                    key={horizon.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-all group"
                                    onMouseEnter={() => setHoveredHorizon(horizon.id)}
                                    onMouseLeave={() => setHoveredHorizon(null)}
                                >
                                    <div className={`w-4 h-4 rounded-full ring-2 ring-white shadow-sm transition-transform group-hover:scale-125`} style={{ backgroundColor: horizon.color }}></div>
                                    <span className={`text-sm font-medium transition-colors ${hoveredHorizon === horizon.id ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{horizon.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Axis Filter */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <Grid3X3 className="h-3 w-3" /> Ejes Estratégicos
                        </h3>
                        <div className="space-y-2">
                            {AXIS_ORDER.filter(a => a !== 'Transversal').map(axis => {
                                return (
                                    <div 
                                        key={axis} 
                                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-all"
                                        onMouseEnter={() => setHoveredSector(axis)}
                                        onMouseLeave={() => setHoveredSector(null)}
                                        onClick={() => toggleAxis(axis)}
                                    >
                                        <div className={`mt-0.5 relative flex items-center justify-center w-5 h-5 rounded-md border transition-colors ${selectedAxes.includes(axis) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                            {selectedAxes.includes(axis) && <Check className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`text-sm block leading-tight transition-colors ${selectedAxes.includes(axis) ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                                {axis}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Type Filter */}
                     <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <FileText className="h-3 w-3" /> Tipo de Instrumento
                        </h3>
                        <div className="space-y-1">
                            {allTypes.map(type => (
                                <label key={type} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                                    <div className={`relative flex items-center justify-center w-4 h-4 rounded border transition-colors ${selectedTypes.includes(type) ? 'bg-teal-500 border-teal-500' : 'border-slate-300 bg-white'}`}>
                                         <input 
                                            type="checkbox" 
                                            checked={selectedTypes.includes(type)} 
                                            onChange={() => toggleType(type)}
                                            className="absolute opacity-0 w-full h-full cursor-pointer"
                                        />
                                        {selectedTypes.includes(type) && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                   
                                    <span className={`text-xs font-medium transition-colors ${selectedTypes.includes(type) ? 'text-slate-700' : 'text-slate-400'}`}>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
