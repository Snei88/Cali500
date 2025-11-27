import React, { useState, useEffect, useMemo } from 'react';
import { CalendarRange, Grid3X3, FileText, Check, Crown, ExternalLink, Activity, Filter } from 'lucide-react';
import { Instrumento } from '@/types';
import { CALI, AXIS_ORDER, VISION_IMAGE_URL } from '@/utils/constants';

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

    // Configuration for rings
    const CENTER = { x: 400, y: 400 };
    const RADII = {
        center: 65,
        corto: { min: 100, max: 170, fixed: 180 },
        mediano: { min: 210, max: 280, fixed: 290 },
        largo: { min: 320, max: 390, fixed: 380 }
    };

    // Configuración de Ejes con Nombres Cortos y Colores de Texto Legibles
    const AXIS_SECTORS: Record<string, any> = {
        'Bienestar Basado en la Interculturalidad': { 
            start: -Math.PI / 2, end: 0, color: CALI.MORADO, labelX: 650, labelY: 150, 
            displayName: "BIENESTAR", textColor: "#3b0764" 
        },
        'Territorio Adaptativo e Inteligente': { 
            start: 0, end: Math.PI / 2, color: CALI.TURQUESA, labelX: 650, labelY: 650, 
            displayName: "TERRITORIO INTELIGENTE", textColor: "#0f766e"
        },
        'Competitividad Sostenible': { 
            start: Math.PI / 2, end: Math.PI, color: CALI.AMARILLO, labelX: 150, labelY: 650, 
            displayName: "COMPETITIVIDAD", textColor: "#b45309" // Ámbar oscuro para leer sobre blanco
        },
        'Transversal': { 
            start: Math.PI, end: 3 * Math.PI / 2, color: CALI.ROSA, labelX: 150, labelY: 150, 
            displayName: "TRANSVERSAL", textColor: "#be185d"
        }
    };

    const nodes = useMemo<MapNode[]>(() => {
        const groups: Record<string, Instrumento[]> = {};
        
        instruments.forEach(inst => {
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
            const sector = AXIS_SECTORS[eje] || { start: 0, end: 2 * Math.PI, color: '#ccc' };
            const fixedR = (RADII[horizon as 'corto' | 'mediano' | 'largo']).fixed;
            
            const sectorSpan = sector.end - sector.start;
            const step = sectorSpan / (groupItems.length + 1);

            groupItems.forEach((inst, index) => {
                const angle = sector.start + (step * (index + 1));
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
    }, [instruments, selectedAxes, selectedTypes]);

    return (
        <div className="flex h-full bg-slate-50">
             {/* Map Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 fade-in relative overflow-hidden">
                <div className="relative w-full max-w-4xl aspect-square bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 mx-auto">
                    <svg viewBox="0 0 800 800" className="w-full h-full font-sans select-none">
                        <defs>
                            <radialGradient id="gradCenter" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stopColor="#4ade80" />
                                <stop offset="100%" stopColor="#16a34a" />
                            </radialGradient>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background Sectors */}
                        {Object.entries(AXIS_SECTORS).map(([name, sector]: any, i) => (
                             <path
                                key={name}
                                d={`M 400 400 L ${400 + 400 * Math.cos(sector.start)} ${400 + 400 * Math.sin(sector.start)} A 400 400 0 0 1 ${400 + 400 * Math.cos(sector.end)} ${400 + 400 * Math.sin(sector.end)} Z`}
                                fill={sector.color}
                                opacity={hoveredItem?.inst.eje === name || hoveredSector === name ? 0.1 : 0.02}
                                className="transition-opacity duration-500"
                            />
                        ))}

                        {/* Rings */}
                        <g>
                            <circle cx="400" cy="400" r="180" fill="none" stroke={hoveredItem?.inst.horizon === 'corto' || hoveredHorizon === 'corto' ? CALI.VERDE : "#cbd5e1"} strokeWidth={hoveredItem?.inst.horizon === 'corto' || hoveredHorizon === 'corto' ? 2 : 1} strokeDasharray={hoveredItem?.inst.horizon === 'corto' || hoveredHorizon === 'corto' ? "0" : "6 4"} className="transition-all duration-300" />
                            <circle cx="400" cy="400" r="290" fill="none" stroke={hoveredItem?.inst.horizon === 'mediano' || hoveredHorizon === 'mediano' ? CALI.AMARILLO : "#cbd5e1"} strokeWidth={hoveredItem?.inst.horizon === 'mediano' || hoveredHorizon === 'mediano' ? 2 : 1} strokeDasharray={hoveredItem?.inst.horizon === 'mediano' || hoveredHorizon === 'mediano' ? "0" : "6 4"} className="transition-all duration-300" />
                            <circle cx="400" cy="400" r="380" fill="none" stroke={hoveredItem?.inst.horizon === 'largo' || hoveredHorizon === 'largo' ? CALI.TURQUESA : "#cbd5e1"} strokeWidth={hoveredItem?.inst.horizon === 'largo' || hoveredHorizon === 'largo' ? 2 : 1} className="transition-all duration-300" opacity="0.6" />
                        </g>

                        {/* Axis Labels */}
                        {Object.entries(AXIS_SECTORS).map(([name, sector]: any) => (
                            <g key={name} opacity={hoveredItem?.inst.eje === name || hoveredSector === name ? 1 : 0.85} className="transition-opacity duration-300">
                                <rect x={sector.labelX - 80} y={sector.labelY - 14} width="160" height="28" rx="14" fill="white" stroke={sector.color} strokeWidth="1.5" className="shadow-sm" />
                                <text x={sector.labelX} y={sector.labelY} fill={sector.textColor} fontSize="11" fontWeight="800" textAnchor="middle" dy=".35em" className="uppercase tracking-wider font-sans">
                                    {sector.displayName}
                                </text>
                            </g>
                        ))}

                        {/* Horizon Labels */}
                        <text x="400" y="210" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold uppercase tracking-widest bg-white/50">Corto Plazo</text>
                        <text x="400" y="100" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold uppercase tracking-widest">Mediano Plazo</text>
                        <text x="400" y="10" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold uppercase tracking-widest">Largo Plazo</text>

                        {/* Center Hub */}
                        <g className="cursor-pointer hover:scale-105 transition-transform duration-300">
                            <circle cx="400" cy="400" r="65" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                            <circle cx="400" cy="400" r="60" fill="url(#gradCenter)" filter="url(#glow)" className="shadow-lg" />
                            <text x="400" y="400" textAnchor="middle" dy=".3em" fill="white" fontWeight="bold" fontSize="22" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}>POAI</text>
                        </g>

                        {/* Instrument Nodes */}
                        {nodes.map((node, i) => {
                            const isHovered = hoveredItem?.inst.id === node.id;
                            const isDimmed = hoveredItem && !isHovered;
                            const isVisionPlan = node.id === 100;
                            
                            return (
                                <g 
                                    key={i} 
                                    className={`cursor-pointer transition-all duration-500 ${node.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                    onMouseEnter={() => node.visible && setHoveredItem({ inst: node, x: node.x, y: node.y })}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    onClick={() => node.visible && onSelect(node)}
                                    style={{ opacity: isDimmed ? 0.3 : 1 }}
                                >
                                    {/* Hover Halo */}
                                    <circle cx={node.x} cy={node.y} r={isHovered ? (isVisionPlan ? 45 : 20) : 0} fill={node.color} opacity="0.2" className="transition-all duration-300" />
                                    
                                    {isVisionPlan ? (
                                        <g>
                                            <circle cx={node.x} cy={node.y} r={isHovered ? 40 : 36} fill="white" stroke={CALI.MORADO} strokeWidth="2" className="shadow-xl transition-all duration-300" />
                                            <image href={VISION_IMAGE_URL} x={node.x - (isHovered ? 28 : 25)} y={node.y - (isHovered ? 28 : 25)} width={isHovered ? 56 : 50} height={isHovered ? 56 : 50} preserveAspectRatio="xMidYMid meet" className="pointer-events-none" />
                                            {/* Pulse effect for main node */}
                                            <circle cx={node.x} cy={node.y} r={42} fill="none" stroke={CALI.MORADO} strokeWidth="1" opacity="0.3" className="animate-pulse pointer-events-none" />
                                        </g>
                                    ) : (
                                        <circle cx={node.x} cy={node.y} r={isHovered ? 10 : 7} fill={node.color} stroke="white" strokeWidth="2" className="shadow-md transition-all duration-300" />
                                    )}

                                    {isHovered && (
                                         <circle cx={node.x} cy={node.y} r={isVisionPlan ? 45 : 14} fill="none" stroke={node.color} strokeWidth="1" className="animate-ping opacity-75" />
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Enhanced Tooltip Card */}
                    {hoveredItem && (
                        <div 
                            className="absolute z-50 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-100 w-72 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-20px] animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden"
                            style={{ 
                                left: `${(hoveredItem.x / 800) * 100}%`, 
                                top: `${(hoveredItem.y / 800) * 100}%` 
                            }}
                        >
                            {hoveredItem.inst.id === 100 ? (
                                <div className="bg-gradient-to-r from-indigo-900 to-purple-800 p-3 text-white flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Crown className="h-4 w-4 text-amber-400" />
                                        <span className="text-xs font-bold tracking-widest uppercase">PLAN RECTOR 2050</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 pb-0 flex items-center justify-between mb-2">
                                    <span 
                                        className="text-[10px] font-extrabold uppercase tracking-widest py-1 px-2 rounded-md text-white shadow-sm"
                                        style={{ backgroundColor: hoveredItem.inst.color }}
                                    >
                                        {hoveredItem.inst.horizon === 'corto' ? 'Corto Plazo' : hoveredItem.inst.horizon === 'mediano' ? 'Mediano Plazo' : 'Largo Plazo'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">ID: {hoveredItem.inst.id}</span>
                                </div>
                            )}
                            
                            <div className="p-4 pt-0 mt-3">
                                <h4 className="font-bold text-slate-800 text-sm leading-snug mb-3 border-b border-slate-100 pb-2">{hoveredItem.inst.nombre}</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <CalendarRange className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="font-semibold text-slate-700">Vigencia: </span>
                                        <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{hoveredItem.inst.inicio} - {hoveredItem.inst.fin}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Activity className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-slate-700">Eje Estratégico: </span>
                                            <span className="text-slate-600 block mt-0.5 leading-tight">{hoveredItem.inst.eje}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                                    <span className="text-[10px] text-indigo-500 font-bold flex items-center justify-center gap-1">
                                        Click para ver detalles <ExternalLink className="h-3 w-3" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Filters for Map */}
            <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-10">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                        <Filter className="h-5 w-5 text-indigo-600" />
                        Filtros Interactivos
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Pasa el mouse sobre las opciones para resaltar en el mapa.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Horizon Filter */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <CalendarRange className="h-3 w-3" /> Temporalidad
                        </h3>
                        <div className="space-y-2">
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
                                    <div className={`w-3 h-3 rounded-full ring-2 ring-white shadow-sm transition-transform group-hover:scale-125`} style={{ backgroundColor: horizon.color }}></div>
                                    <span className={`text-xs font-medium transition-colors ${hoveredHorizon === horizon.id ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{horizon.label}</span>
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
                            {AXIS_ORDER.map(axis => {
                                const color = AXIS_SECTORS[axis]?.color;
                                return (
                                    <div 
                                        key={axis} 
                                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-all"
                                        onMouseEnter={() => setHoveredSector(axis)}
                                        onMouseLeave={() => setHoveredSector(null)}
                                        onClick={() => toggleAxis(axis)}
                                    >
                                        <div className={`mt-0.5 relative flex items-center justify-center w-4 h-4 rounded border transition-colors ${selectedAxes.includes(axis) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                            {selectedAxes.includes(axis) && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`text-xs block leading-tight transition-colors ${selectedAxes.includes(axis) ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                                {axis}
                                            </span>
                                            <div className="h-0.5 w-0 group-hover:w-full bg-indigo-600/20 mt-1 transition-all duration-500 rounded-full" style={{ backgroundColor: color }}></div>
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
                        <div className="space-y-2">
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