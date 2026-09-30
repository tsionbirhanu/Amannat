import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex text-slate-800 antialiased overflow-x-hidden">
        {/* BEGIN: LeftSidebar */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200/90 flex flex-col justify-between p-5 min-h-screen">
          <div className="space-y-7">
            {/* App Brand Logo & Title */}
            <div className="flex items-center space-x-3 px-1">
              <img alt="Amannat Logo" className="w-9 h-9 rounded-xl object-contain shadow-sm" src="https://lh3.googleusercontent.com/aida/AEtjO1XVcTbCS_rf0ab-_DZUTW4gVSt4K3AEWlPXVVWhcvhDuQKyHeMco5_Nacc-y3uSPCDzcNnmR0fSTR3Doi8DP8HNJdVv4dxS5DuZ7V5-5lhN1VhCYD7s5UPq_qLa_WX_-26hYiUaatbrpO-DQ8F84KpniayZzxRj-dMhB55xVtq4MGLO1VspZsppzT_n8D8YsbsyIM3fejfma5A3y0BJP0iS3BkPz9lQ0PP4V7WCyGYA69bPDT3BQ-KsHg" />
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">Amannat</h1>
                <p className="text-[11px] font-medium text-slate-500">Worker Safety & Trust</p>
              </div>
            </div>
            {/* Navigation Menu */}
            <nav aria-label="Main Navigation" className="space-y-1.5">
              <Link className="flex items-center space-x-3 px-3.5 py-2.5 bg-[#17253b] text-white rounded-xl font-medium text-sm transition-all shadow-sm" href="/">
                <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>Dashboard</span>
              </Link>
              <Link className="flex items-center space-x-3 px-3.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors" href="/record">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M3 8h4M3 12h2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>Contract & Wages</span>
              </Link>
              <Link className="flex items-center space-x-3 px-3.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors" href="/registry">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>Trust Registry</span>
              </Link>
              <Link className="flex items-center space-x-3 px-3.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors" href="#">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>Voice Assistant</span>
              </Link>
              <Link className="flex items-center space-x-3 px-3.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors" href="/safety">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>Safety & SOS</span>
              </Link>
              <Link className="flex items-center space-x-3 px-3.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors" href="/council">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>Governance Council</span>
              </Link>
            </nav>
          </div>
          {/* Bottom Sidebar Card */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-800">
              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="text-xs font-semibold text-emerald-900">Encrypted Vault</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Sovereign ledger data protected by decentral protocol.
            </p>
          </div>
        </aside>

        {/* BEGIN: MainContentArea */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          <header className="h-16 px-8 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur sticky top-0 z-30">
            {/* Left Pill Tag */}
            <div className="inline-flex items-center space-x-2 bg-emerald-50/80 border border-emerald-200/60 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Ethiopia to Gulf Corridor: <strong className="text-emerald-700 font-semibold">Verified Safe</strong></span>
            </div>
            {/* Right Header Actions */}
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/70 text-xs font-semibold transition-colors">
                <svg className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>Quick Exit</span>
              </button>
              <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
                <img alt="Bethlehem T." className="w-9 h-9 rounded-full object-cover border border-slate-200" src="https://lh3.googleusercontent.com/aida/AEtjO1UXpENQOv3QHs7IyFZd6WrXHwwPGuZi_Y7pfgkJvQxt6JAplZOPSqpWyIg-krJS9giEH_hSWkMjYWxVqiK1e2LfbCqG-u3hlQfBkJdK2NAc5LtrE0Sh3YZ1fDJZLFJxtcCDCumL_SWZB_Eh9E0EGU9r6vPQlIyTTu5hcGm6pMoqUKnXxxEI7DWaq_FhSZzOWtmQuE3b6YkYjpMCjifxRLBdK7LN-62XwIawXrm5igRDNOTJkm_zt2CLVfg" />
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">Bethlehem T.</p>
                  <p className="text-[11px] text-slate-500">Verified Worker</p>
                </div>
              </div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
