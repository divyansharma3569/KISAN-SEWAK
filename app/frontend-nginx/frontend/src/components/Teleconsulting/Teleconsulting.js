import React from 'react';
import { useTranslation } from "react-i18next";

const Teleconsulting = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Glow Effects to match Home Page */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20 mt-10 relative z-10">
        <div className="inline-block px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm mb-8 tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          {t('teleconsulting.comingSoon')}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 mb-8 py-4 leading-normal">
          {t('teleconsulting.title')}
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
          {t('teleconsulting.subtitle')}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full relative z-10">
         
         {/* Feature Card 1 */}
         <div className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-md hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-4">{t('teleconsulting.feature1Title')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{t('teleconsulting.feature1Desc')}</p>
         </div>

         {/* Feature Card 2 */}
         <div className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-md hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 text-amber-400 border border-amber-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-4">{t('teleconsulting.feature2Title')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{t('teleconsulting.feature2Desc')}</p>
         </div>

         {/* Feature Card 3 */}
         <div className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-md hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-16 w-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 border border-cyan-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.957 11.957 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-4">{t('teleconsulting.feature3Title')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{t('teleconsulting.feature3Desc')}</p>
         </div>

      </div>
    </div>
  );
}

export default Teleconsulting;