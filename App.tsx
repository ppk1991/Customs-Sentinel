
import React, { useState } from 'react';
import { MOCK_DECLARATIONS, MOCK_EVENTS, BQS_VOLUME_DATA } from './constants';
import { Declaration, View, CustomsEvent, RiskLevel } from './types';
import StatsCard from './components/StatsCard';
import DeclarationRow from './components/DeclarationRow';
import DeclarationDetails from './components/DeclarationDetails';
import SentinelChat from './components/SentinelChat';
import Sidebar from './components/Sidebar';
import { simulateScenario } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [declarations] = useState<Declaration[]>(MOCK_DECLARATIONS);
  const [selectedDec, setSelectedDec] = useState<Declaration | null>(null);
  const [simulatorInput, setSimulatorInput] = useState('');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');

  const handleRunSimulation = async () => {
    if (!simulatorInput.trim()) return;
    setIsSimulating(true);
    try {
      const result = await simulateScenario(simulatorInput);
      setSimulationResult(result);
    } catch (e) {
      setSimulationResult("Failed to run simulation. Please try again.");
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredDeclarations = riskFilter === 'ALL' 
    ? declarations 
    : declarations.filter(d => d.riskLevel === riskFilter);

  const getHeaderTitle = (view: View): string => {
    switch(view) {
      case 'dashboard': return 'Strategic Dashboard';
      case 'upload': return 'Data Ingestion Hub';
      case 'declarations': return 'Inbound Queue';
      case 'risk-engine': return 'Risk Engine Logic';
      case 'simulator': return 'Scenario Simulator';
      case 'case-history': return 'Forensic Archive';
      case 'admin': return 'System Admin';
      default: return 'Customs Sentinel';
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Command Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard label="Queue Size" value={declarations.length} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path></svg>} trend="+5%" trendColor="bg-blue-100 text-blue-700" />
              <StatsCard label="Seizures (MTD)" value={MOCK_EVENTS.filter(e => e.type === 'SEIZURE').length} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} trend="+12.4%" />
              <StatsCard label="Detection Rate" value="12.4%" trend="+1.2%" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>} />
              <StatsCard label="Value Audited" value="$14.2M" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Intelligence Feed */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Strategic Intel Feed</h3>
                    <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                  </div>
                  <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {MOCK_EVENTS.map(e => (
                      <div key={e.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl group hover:border-indigo-200 transition-all">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{e.type}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{e.date}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{e.description}</p>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">View All Events</button>
                </div>
              </div>

              {/* BQS Intelligence Panel */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">BQS: Border Queue System Intelligence</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Traffic Segmentation & Risk context</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">Live Traffic</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest font-black">
                          <th className="py-4 px-2">Category</th>
                          <th className="py-4 px-2">Volume</th>
                          <th className="py-4 px-2">Risk Analysis</th>
                          <th className="py-4 px-2">Operational Context</th>
                        </tr>
                      </thead>
                      <tbody>
                        {BQS_VOLUME_DATA.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-2 font-bold text-slate-800">{item.category}</td>
                            <td className="py-4 px-2 font-mono font-bold text-indigo-600">{item.volume.toLocaleString()}</td>
                            <td className="py-4 px-2 text-slate-600">{item.riskAnalysis}</td>
                            <td className="py-4 px-2 italic text-slate-400 text-[11px] leading-tight">{item.context}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Risk Stratification Map</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Queue Distribution</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-40 px-8 relative">
                    <div className="w-16 bg-gradient-to-t from-emerald-100 to-emerald-400 h-[60%] rounded-t-xl flex flex-col items-center justify-end pb-3 text-[10px] font-black text-emerald-900 shadow-lg shadow-emerald-100/50 z-10 transition-all hover:scale-105">60%</div>
                    <div className="w-16 bg-gradient-to-t from-amber-100 to-amber-400 h-[25%] rounded-t-xl flex flex-col items-center justify-end pb-3 text-[10px] font-black text-amber-900 shadow-lg shadow-amber-100/50 z-10 transition-all hover:scale-105">25%</div>
                    <div className="w-16 bg-gradient-to-t from-orange-100 to-orange-400 h-[10%] rounded-t-xl flex flex-col items-center justify-end pb-3 text-[10px] font-black text-orange-900 shadow-lg shadow-orange-100/50 z-10 transition-all hover:scale-105">10%</div>
                    <div className="w-16 bg-gradient-to-t from-red-100 to-red-400 h-[5%] rounded-t-xl flex flex-col items-center justify-end pb-3 text-[10px] font-black text-red-900 shadow-lg shadow-red-100/50 z-10 transition-all hover:scale-105">5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'upload':
        return (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-12">
            <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-6 shadow-2xl shadow-slate-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-3">Manifest Ingestion Hub</h2>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed font-medium">Drag and drop declaration batches for bulk Sentinel risk evaluation. Supports JSON, CSV, and XML manifest formats.</p>
                <div className="mt-12 flex gap-4 justify-center">
                  <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
                    Select Manifests
                  </button>
                  <button className="bg-white border border-slate-200 text-slate-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                    WCO Template
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 shadow-xl">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Sentinel API Integration</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-indigo-500 uppercase px-2 py-0.5 bg-indigo-500/10 rounded">POST</span>
                    <code className="text-[11px] text-slate-300 font-mono truncate">/v1/inbound/manifest</code>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-green-500 uppercase px-2 py-0.5 bg-green-500/10 rounded">GET</span>
                    <code className="text-[11px] text-slate-300 font-mono truncate">/v1/registry/hs-codes</code>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Active Schema Validation</h4>
                <div className="space-y-3">
                  {['Trader ID Mapping', 'HS Code Length (6+)', 'Currency Normalization', 'Entity Fraud Check'].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'declarations':
        return (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50 gap-6">
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Active Inbound Queue</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Division 4 Operational Workflow</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Filter:</span>
                  <select 
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value as any)}
                    className="bg-white border border-slate-200 text-xs font-black uppercase tracking-tight px-5 py-3 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm min-w-[180px] transition-all"
                  >
                    <option value="ALL">ALL RISK PROFILES</option>
                    <option value={RiskLevel.LOW}>LOW RISK ONLY</option>
                    <option value={RiskLevel.MEDIUM}>MODERATE RISK</option>
                    <option value={RiskLevel.HIGH}>ELEVATED RISK</option>
                    <option value={RiskLevel.CRITICAL}>CRITICAL THREATS</option>
                  </select>
                </div>
                <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-slate-100">
                    <th className="py-6 px-8">Manifest ID</th>
                    <th className="py-6 px-8">Importer Entity</th>
                    <th className="py-6 px-8">Classification</th>
                    <th className="py-6 px-8">Declared Value</th>
                    <th className="py-6 px-8">Sentinel Index</th>
                    <th className="py-6 px-8">Doc Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeclarations.length > 0 ? (
                    filteredDeclarations.map(dec => (
                      <DeclarationRow key={dec.id} declaration={dec} onSelect={setSelectedDec} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-24 text-center">
                        <div className="max-w-xs mx-auto space-y-4">
                           <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                           </div>
                           <p className="text-sm font-bold text-slate-400 italic">No declarations match the requested risk stratification parameters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        );
      case 'risk-engine':
        return (
          <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Logic Blueprint Section */}
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">Sentinel Neural Protocol v4.0</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">The Sentinel engine utilizes a multi-layered reasoning approach to detect tariff evasion, entity fraud, and prohibited commodity misclassification in real-time.</p>
              </div>
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { title: "Semantic Analysis", desc: "Extracts material tokens from manifest text fields to verify HS Code alignment.", step: "01" },
                  { title: "Valuation Regression", desc: "Calculates Z-score deviations against global pricing baselines.", step: "02" },
                  { title: "Network Forensics", desc: "Maps entity relationships to identify shell companies and sanction evasion.", step: "03" }
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="text-[64px] font-black text-slate-50 leading-none absolute -top-8 -left-4 group-hover:text-indigo-50 transition-colors">{item.step}</div>
                    <div className="relative z-10 space-y-3">
                      <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Intelligence Panel */}
            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/20">
               <div className="p-10 border-b border-white/5 bg-gradient-to-r from-slate-900 to-indigo-950 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Surveillance Profile</h3>
                       <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]">Watchlist Category: 8542-PRO</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Update Registry</button>
               </div>
               
               <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 group hover:border-indigo-500/30 transition-all">
                        <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">WCO Technical Master Definition</h4>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">Integrated electronic circuits: Processors, controllers, and complex logic arrays. Critical for high-tech export control monitoring.</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                           <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Standard Tariff</p>
                           <p className="text-2xl font-black text-white">0.0% <span className="text-[10px] text-indigo-400">MFN</span></p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                           <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Audit Frequency</p>
                           <p className="text-2xl font-black text-white">4.2% <span className="text-[10px] text-red-400">HIGH</span></p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-indigo-600/5 rounded-[2rem] border border-indigo-500/20 p-8">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Known Fraud Signatures</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'HS 8517.62', desc: 'Misdeclaration as simple networking routers to hide crypto-accelerators.', risk: 'CRIT' },
                        { label: 'HS 9013.80', desc: 'Optical lensing sub-assemblies declared as generic lighting.', risk: 'HIGH' }
                      ].map((sig, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                          <div className={`w-1.5 h-auto rounded-full ${sig.risk === 'CRIT' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                          <div>
                            <p className="text-[10px] font-mono font-black text-indigo-400 mb-1">{sig.label}</p>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">{sig.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'simulator':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"></path></svg>
              </div>
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Predictive Scenario Simulator</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">Run hypothetical trade scenarios to predict compliance outcomes based on shifting geopolitical triggers and historical hit patterns.</p>
                
                <div className="space-y-6">
                  <div className="relative">
                    <textarea 
                      value={simulatorInput}
                      onChange={(e) => setSimulatorInput(e.target.value)}
                      placeholder="e.g., A first-time importer bringing in 10,000 units of titanium-alloy parts from a high-risk transshipment hub..."
                      className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-300 uppercase">Input Buffer: {simulatorInput.length} chars</div>
                  </div>
                  <button 
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSimulating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Generating Prediction...
                      </>
                    ) : "Generate Risk Projection"}
                  </button>
                </div>
              </div>
            </div>

            {simulationResult && (
              <div className="bg-indigo-900 text-white p-12 rounded-[2.5rem] border border-indigo-800 shadow-2xl shadow-indigo-900/30 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none">
                   <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </div>
                     <h3 className="text-xl font-black uppercase tracking-tight">Intelligence Forecast Summary</h3>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    {simulationResult.split('\n').map((line, i) => (
                      <p key={i} className="mb-4 text-indigo-100 font-medium leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
                    <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">Save as Case</button>
                    <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Print PDF</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'case-history':
        return (
          <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Forensic Incident Archive</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Confirmed Compliance Breaches & Seizures</p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Export CSV</button>
                <div className="relative">
                  <input type="text" placeholder="Search Case ID..." className="bg-white border border-slate-200 rounded-xl px-10 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 min-w-[240px]" />
                  <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-slate-100">
                    <th className="py-6 px-10">Timestamp</th>
                    <th className="py-6 px-10">Event Matrix</th>
                    <th className="py-6 px-10">Operational Detail</th>
                    <th className="py-6 px-10">Entity Trace</th>
                    <th className="py-6 px-10">Enforcement Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EVENTS.map(event => (
                    <tr key={event.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-all group">
                      <td className="py-6 px-10 text-xs font-black text-slate-500 font-mono">{event.date}</td>
                      <td className="py-6 px-10">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${
                          event.type === 'SEIZURE' ? 'bg-red-50 text-red-600 border-red-100' : 
                          event.type === 'FRAUD' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                          'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>{event.type}</span>
                      </td>
                      <td className="py-6 px-10 text-xs text-slate-600 font-medium max-w-xs leading-relaxed">{event.description}</td>
                      <td className="py-6 px-10 text-[10px] text-slate-400 font-black uppercase tracking-tight italic">{event.entities.join(' / ')}</td>
                      <td className="py-6 px-10 text-xs font-black text-indigo-600 tracking-tight uppercase group-hover:translate-x-1 transition-transform">{event.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      case 'admin':
        return (
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 max-w-3xl shadow-sm animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">System Administration</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-2">AI Sensitivity Threshold</h4>
                  <p className="text-[11px] text-slate-500 font-medium mb-6">Current trigger level for mandatory physical inspection.</p>
                  <input type="range" className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer" />
                  <div className="flex justify-between mt-2 text-[9px] font-black text-slate-400 uppercase">
                    <span>Lenient (40)</span>
                    <span className="text-indigo-600">Active (75)</span>
                    <span>Strict (95)</span>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-2">Grounding Registry Connection</h4>
                  <p className="text-[11px] text-slate-500 font-medium mb-4">World Customs Org (WCO) Master Database v4.2</p>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Secured Uplink Active</span>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-100 flex gap-4">
                 <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">Save Configuration</button>
                 <button className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-all">Factory Reset</button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Invalid View Selection.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-10 py-6 flex items-center justify-between backdrop-blur-md bg-white/90">
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{getHeaderTitle(currentView)}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Division Dashboard</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">PoC v1.0.4</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-xs font-black text-slate-800 tracking-tighter">0.02ms Engine Latency</p>
                <div className="flex items-center gap-2 justify-end">
                   <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Neural Layer Active</span>
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </div>
             </div>
             <div className="h-10 w-px bg-slate-100"></div>
             <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
             </button>
          </div>
        </header>

        <main className="flex-1 p-10 overflow-y-auto">
          {renderContent()}
        </main>

        <DeclarationDetails 
          declaration={selectedDec} 
          onClose={() => setSelectedDec(null)} 
        />

        <SentinelChat />
        
        <footer className="p-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-t border-slate-200 flex justify-between bg-white">
           <div className="flex items-center gap-4">
              <span>© 2024 Customs Sentinel Intelligence PoC</span>
              <span className="h-3 w-px bg-slate-200"></span>
              <span className="text-slate-300">Level 4 Clearance Required</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-indigo-600 font-black">SENTINEL-NODE: READY</span>
              <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
