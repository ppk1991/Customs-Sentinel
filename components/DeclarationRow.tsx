
import React from 'react';
import { Declaration, RiskLevel } from '../types';
import { HS_CODE_REGISTRY } from '../constants';

interface DeclarationRowProps {
  declaration: Declaration;
  onSelect: (dec: Declaration) => void;
}

const getRiskConfig = (score: number) => {
  if (score >= 70) {
    return {
      colorClass: 'text-red-600',
      bgClass: 'bg-red-500',
      gradientClass: 'bg-gradient-to-r from-red-500 to-red-700',
      shadowClass: 'shadow-[0_0_10px_rgba(220,38,38,0.4)]',
      label: 'HIGH RISK',
      bgLight: 'bg-red-50',
      borderClass: 'border-red-200'
    };
  }
  if (score >= 30) {
    return {
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-500',
      gradientClass: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      shadowClass: 'shadow-[0_0_10px_rgba(202,138,4,0.3)]',
      label: 'MEDIUM RISK',
      bgLight: 'bg-yellow-50',
      borderClass: 'border-yellow-200'
    };
  }
  return {
    colorClass: 'text-green-600',
    bgClass: 'bg-green-500',
    gradientClass: 'bg-gradient-to-r from-green-400 to-green-600',
    shadowClass: 'shadow-[0_0_10px_rgba(22,163,74,0.3)]',
    label: 'LOW RISK',
    bgLight: 'bg-green-50',
    borderClass: 'border-green-200'
  };
};

const DeclarationRow: React.FC<DeclarationRowProps> = ({ declaration, onSelect }) => {
  const config = getRiskConfig(declaration.riskScore);
  
  // Fetch full description from registry or provide fallback
  const hsDescription = HS_CODE_REGISTRY[declaration.hsCode] || "Technical description for this HS Code is not currently indexed in the local intelligence registry. Consult WCO Master Database.";

  return (
    <tr 
      onClick={() => onSelect(declaration)}
      className="hover:bg-slate-50/80 cursor-pointer transition-all border-b border-slate-100 group"
    >
      <td className="py-5 px-6 text-sm font-black text-indigo-600 group-hover:text-indigo-700">
        #{declaration.id}
      </td>
      <td className="py-5 px-6">
        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">{declaration.importer}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{declaration.originCountry}</div>
      </td>
      <td className="py-5 px-6">
        <div className="text-sm text-slate-700 truncate max-w-[180px] font-medium">{declaration.itemDescription}</div>
        
        {/* HS Code with Hover Intelligence Tooltip */}
        <div className="relative inline-block mt-1 group/hs">
          <div className="text-[10px] font-black text-indigo-400/80 uppercase tracking-tighter flex items-center gap-1 cursor-help hover:text-indigo-600 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            HS {declaration.hsCode}
          </div>
          
          {/* Tooltip implementation: Displays HS description from registry on hover */}
          {/* z-[100] and fixed width ensure visibility; scale animation adds polish */}
          <div className="absolute left-0 bottom-full mb-3 w-80 p-5 bg-slate-900 text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 opacity-0 invisible group-hover/hs:opacity-100 group-hover/hs:visible transition-all duration-300 z-[100] scale-90 group-hover/hs:scale-100 origin-bottom-left pointer-events-none">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">WCO Registry Intel</span>
              </div>
              <span className="text-[10px] font-mono font-black text-white/40">CODE: {declaration.hsCode}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-200 font-medium italic">
              {hsDescription}
            </p>
            {/* Tooltip arrow */}
            <div className="absolute left-4 -bottom-1 w-3 h-3 bg-slate-900 border-r border-b border-white/10 transform rotate-45"></div>
          </div>
        </div>
      </td>
      <td className="py-5 px-6 text-sm font-black text-slate-900 font-mono">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: declaration.currency }).format(declaration.declaredValue)}
      </td>
      <td className="py-5 px-6">
        <div className="flex items-center gap-4">
          <div className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 shadow-sm flex-shrink-0 transition-all group-hover:scale-110 group-hover:shadow-md ${config.bgLight} ${config.borderClass}`}>
            <span className={`text-xl font-black leading-none ${config.colorClass}`}>
              {declaration.riskScore}
            </span>
            <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${config.colorClass} opacity-80`}>INDEX</span>
          </div>

          <div className="flex-1 min-w-[140px]">
            <div className="flex justify-between items-end mb-1">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assessment</span>
               <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${config.bgClass} text-white shadow-sm`}>
                 {config.label}
               </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60 p-[1px]">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${config.gradientClass}`}
                style={{ width: `${declaration.riskScore}%` }}
              />
            </div>
          </div>
        </div>
      </td>
      <td className="py-5 px-6">
        {/* Document Health Indicators */}
        <div className="flex gap-1.5">
          {declaration.documentStatus?.map((doc, i) => {
            const statusColor = doc.status === 'PRESENT' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.3)]' : 
                               doc.status === 'MISSING' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.3)]' : 
                               'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.3)]';
            return (
              <div 
                key={i} 
                className={`w-3.5 h-3.5 rounded-full ${statusColor} border border-white/20 transition-transform group-hover:scale-110 relative group/doc`}
              >
                {/* Micro-tooltip on dot hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/doc:block bg-slate-800 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-xl whitespace-nowrap z-50">
                  {doc.name}: {doc.status}
                </div>
              </div>
            );
          })}
          {(!declaration.documentStatus || declaration.documentStatus.length === 0) && (
            <span className="text-[9px] font-black text-slate-300 uppercase italic">No Docs</span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default DeclarationRow;
