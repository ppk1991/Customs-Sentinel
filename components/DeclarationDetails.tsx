
import React, { useState, useEffect } from 'react';
import { Declaration, RiskAnalysisResponse } from '../types';
import { analyzeDeclaration } from '../services/geminiService';

interface DeclarationDetailsProps {
  declaration: Declaration | null;
  onClose: () => void;
}

const DeclarationDetails: React.FC<DeclarationDetailsProps> = ({ declaration, onClose }) => {
  const [analysis, setAnalysis] = useState<RiskAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isScanningDocs, setIsScanningDocs] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  useEffect(() => {
    if (declaration) {
      setAnalysis(null);
      handleAnalyze();
    }
  }, [declaration]);

  const handleAnalyze = async () => {
    if (!declaration) return;
    setLoading(true);
    try {
      const result = await analyzeDeclaration(declaration);
      setAnalysis(result);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualScan = async () => {
    if (!declaration) return;
    setIsScanningDocs(true);
    try {
      const result = await analyzeDeclaration(declaration);
      setAnalysis(result);
    } catch (error) {
      console.error("Document scan failed", error);
    } finally {
      setIsScanningDocs(false);
    }
  };

  const handleViewDocs = () => {
    setShowDocModal(true);
  };

  if (!declaration) return null;

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform border-l border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Declaration Details</h2>
            <p className="text-xs text-slate-500 font-medium">REF: {declaration.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {isScanningDocs && (
          <div className="absolute inset-0 z-[60] bg-indigo-900/10 backdrop-blur-[2px] flex items-center justify-center p-8 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-indigo-100 max-w-xs w-full space-y-4 animate-in fade-in zoom-in duration-300">
               <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                  <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </div>
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">HS-SCAN: Verification in Progress</h4>
               <p className="text-xs text-slate-500 leading-relaxed">Sentinel is cross-referencing manifest documents with HS classification registries and historical fraud signatures...</p>
               <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
               </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading && !isScanningDocs && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-pulse flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-2 bg-indigo-200 rounded-full w-3/4"></div>
                <div className="h-2 bg-indigo-100 rounded-full w-1/2"></div>
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Neural Scanning...</span>
            </div>
          )}

          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">General Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Origin Country</p>
                <p className="text-sm font-bold text-slate-900">{declaration.originCountry}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Declared Value</p>
                <p className="text-sm font-bold text-slate-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: declaration.currency }).format(declaration.declaredValue)}</p>
              </div>
              <div className="col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Importer Entity</p>
                <p className="text-sm font-bold text-slate-900">{declaration.importer}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Document Audit</h3>
              <div className="flex gap-2">
                <button 
                  onClick={handleManualScan}
                  disabled={isScanningDocs || loading}
                  className="flex items-center gap-1.5 text-[10px] font-black text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-700 transition-all uppercase tracking-widest shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  Scan Documents
                </button>
                <button 
                  onClick={handleViewDocs}
                  className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-all uppercase tracking-widest shadow-sm active:scale-95"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  View Refs
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {declaration.documentStatus?.map((doc, i) => {
                let statusConfig = {
                  bg: 'bg-white border-slate-100',
                  iconBg: 'bg-emerald-100 text-emerald-600',
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>,
                  textColor: 'text-slate-700',
                  statusColor: 'text-emerald-600'
                };

                if (doc.status === 'MISSING') {
                  statusConfig = {
                    bg: 'bg-red-50 border-red-100 ring-1 ring-red-500/10',
                    iconBg: 'bg-red-600 text-white',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>,
                    textColor: 'text-red-900',
                    statusColor: 'text-red-600'
                  };
                } else if (doc.status === 'INCONSISTENT') {
                  statusConfig = {
                    bg: 'bg-amber-50 border-amber-200 ring-1 ring-amber-500/10',
                    iconBg: 'bg-amber-500 text-white',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>,
                    textColor: 'text-amber-900',
                    statusColor: 'text-amber-600'
                  };
                }

                return (
                  <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl border shadow-sm transition-all ${statusConfig.bg}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${statusConfig.iconBg}`}>
                        {statusConfig.icon}
                      </div>
                      <div>
                        <p className={`text-[12px] font-black uppercase tracking-tight ${statusConfig.textColor}`}>{doc.name}</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${statusConfig.statusColor}`}>STATUS: {doc.status}</p>
                      </div>
                    </div>
                    {doc.status === 'PRESENT' && (
                      <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {analysis?.documentAnalysis && analysis.documentAnalysis.length > 0 && (
            <section className="p-5 rounded-2xl border-2 border-red-100 bg-red-50/30 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 className="text-xs font-black text-red-800 uppercase tracking-widest">Inconsistency Alerts</h3>
              </div>
              <div className="space-y-4">
                {analysis.documentAnalysis.map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-white/60 backdrop-blur rounded-xl border border-red-50">
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      item.severity === 'HIGH' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                      item.severity === 'MEDIUM' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1.5">{item.indicator_id}</p>
                      <p className="text-sm text-slate-800 font-medium leading-tight">{item.finding}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4 bg-slate-900 p-5 rounded-2xl shadow-xl shadow-slate-200 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"></path></svg>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Sentinel Verdict</h3>
              {loading && !isScanningDocs && <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />}
            </div>

            {analysis ? (
              <div className="space-y-4 relative z-10">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Risk Evaluation</p>
                    <p className={`text-2xl font-black ${analysis.score > 70 ? 'text-red-400' : 'text-emerald-400'}`}>{analysis.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Confidence Score</p>
                    <p className="text-4xl font-black text-white">{analysis.score}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">AI Reasoning</p>
                  <p className="text-sm text-slate-200 leading-relaxed italic">"{analysis.analysis}"</p>
                </div>
              </div>
            ) : (
              !loading && <p className="text-sm text-slate-500 italic">Analysis ready for generation.</p>
            )}
          </section>

          <section className="pt-4 flex flex-col gap-3 pb-8">
              <button 
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                onClick={onClose}
              >
                Return to Queue
              </button>
              <div className="flex gap-2">
                <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Print Dossier
                </button>
                <button className="flex-1 bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all">
                    Flag Entry
                </button>
              </div>
          </section>
        </div>
      </div>

      {showDocModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Digital Documents</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verified Registry</p>
              </div>
              <button 
                onClick={() => setShowDocModal(false)} 
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6">
              {declaration.documentRefs && declaration.documentRefs.length > 0 ? (
                <div className="space-y-3">
                  {declaration.documentRefs.map((ref, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                      <div className="w-10 h-10 bg-white border border-slate-200 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Reference Number</p>
                        <span className="text-xs font-mono font-black text-slate-800 tracking-tight">{ref}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012-2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-400 italic">No external document references identified for this manifest.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50/80 border-t border-slate-100">
              <button 
                onClick={() => setShowDocModal(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  );
};

export default DeclarationDetails;
