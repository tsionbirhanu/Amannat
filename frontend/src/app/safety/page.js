'use client';
import { useState, useEffect } from 'react';

export default function SafetyPage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micStatus, setMicStatus] = useState("Tap to Speak");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const exitBtn = document.querySelector('button[title="Quick Disguise Exit"]');
        if (exitBtn) {
          exitBtn.click();
        } else {
          document.body.style.display = 'none';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setTimeout(() => {
      setIsCheckedIn(false);
    }, 3000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setMicStatus("Listening in English...");
    } else {
      setMicStatus("Processing speech prompt...");
      setTimeout(() => {
        setMicStatus("Tap to Speak");
      }, 1500);
    }
  };

  const handlePresetClick = () => {
    setMicStatus("Analyzing query...");
    setTimeout(() => {
      setMicStatus("Audio response ready");
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-space-xl w-full">
        
        {/* 1. WELCOME & STATUS BANNER */}
        <section className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-[0_2px_12px_rgba(30,41,59,0.04)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Welcome back, Bethlehem</h1>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low">
                <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container -ml-3.5"></span>
                <span className="font-label-md text-label-md text-on-surface">Status: Safe & Synced</span>
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">Worker Safety & Portable Records · Riyadh, Saudi Arabia</p>
            <div className="flex items-center gap-2 pt-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-surface-tint">schedule</span>
              <span className="font-body-sm text-body-sm">Next scheduled check-in: <strong className="text-on-surface font-semibold">Sunday at 6:00 PM</strong></span>
            </div>
          </div>
          
          {/* Fast Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <button 
              id="btn-checkin"
              onClick={handleCheckIn}
              className={`flex-1 lg:flex-initial h-13 px-6 py-3.5 rounded-xl text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2.5 shadow-sm transition-all ${isCheckedIn ? 'bg-tertiary-container' : 'bg-primary hover:bg-primary-container'}`} 
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">check_circle</span>
              <span id="checkin-label">{isCheckedIn ? "Safe Check-in Confirmed!" : "Check-in Now (I am safe)"}</span>
            </button>
            <button id="btn-sos" className="flex-1 lg:flex-initial h-13 px-5 py-3.5 rounded-xl bg-error-container text-on-error-container font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-error hover:text-on-error transition-all group" type="button">
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">emergency_home</span>
              <span>Hold for SOS</span>
            </button>
          </div>
        </section>

        {/* 2. KEY METRICS ROW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_2px_8px_rgba(30,41,59,0.04)] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Wages Received</span>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-md text-headline-md text-primary font-bold">$2,800</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">/ $3,200</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                <div className="bg-on-tertiary-container h-full rounded-full" style={{ width: '87.5%' }}></div>
              </div>
              <span className="font-body-sm text-body-sm text-on-tertiary-container font-medium pt-1">October salary logged (90% on time)</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_2px_8px_rgba(30,41,59,0.04)] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Contract Validity</span>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-headline-md text-headline-md text-primary font-bold">16 Months</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Remaining on term</span>
              <span className="font-body-sm text-body-sm text-on-tertiary-container font-medium pt-1">Bilateral agreement verified</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_2px_8px_rgba(30,41,59,0.04)] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Trust Registry</span>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-tertiary-container">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-headline-md text-primary font-bold">Agency Verified</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Ethio-Gulf Bilateral Agency</span>
              <span className="font-body-sm text-body-sm text-on-surface font-semibold pt-1">Grade A Credential</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_2px_8px_rgba(30,41,59,0.04)] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Safety Status</span>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-headline-md text-headline-md text-primary font-bold">All 5 Active</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Trusted safety guardians</span>
              <span className="font-body-sm text-body-sm text-on-tertiary-container font-medium pt-1">Consular hotline standby</span>
            </div>
          </div>
        </section>

        {/* 3. MAIN CONTENT GRID (Left 60%, Right 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* SECTION A: Portable Wage & Contract Snapshot */}
            <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-[0_2px_12px_rgba(30,41,59,0.04)] flex flex-col gap-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">contract</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Portable Wage & Contract Snapshot</h2>
                </div>
                <span className="font-label-md text-label-md text-on-tertiary-container bg-surface-container-low px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">lock</span> Encrypted Vault Copy
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-xl bg-surface-container-low">
                <div className="flex flex-col gap-1">
                  <span className="font-label-md text-label-md text-on-surface-variant">Household Employer</span>
                  <span className="font-label-lg text-label-lg text-on-surface">Al-Mansoor Family</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Riyadh, Al-Malaz District</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-md text-label-md text-on-surface-variant">Agreed Wage</span>
                  <span className="font-label-lg text-label-lg text-on-surface">1,500 SAR / Month</span>
                  <span className="font-body-sm text-body-sm text-on-tertiary-container font-medium">Auto-disbursed via digital ledger</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-md text-label-md text-on-surface-variant">Weekly Rest Day</span>
                  <span className="font-label-lg text-label-lg text-on-surface">Every Friday</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Guaranteed 24-hr rest window</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Recent Disbursement Records</span>
                
                <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-tertiary-container text-[24px]">verified</span>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface">October 2024 Base Salary</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Direct mobile transfer · Deposited Oct 29</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">1,500 SAR</span>
                    <p className="font-body-sm text-body-sm text-on-tertiary-container">Receipt Confirmed</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-tertiary-container text-[24px]">verified</span>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface">September 2024 Base Salary</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Direct mobile transfer · Deposited Sep 30</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">1,500 SAR</span>
                    <p className="font-body-sm text-body-sm text-on-tertiary-container">Receipt Confirmed</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-2 hover:bg-primary transition-all" type="button">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>View Full Contract</span>
                </button>
                <button className="px-5 py-2.5 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center gap-2 hover:bg-surface-container-high transition-all" type="button">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Log New Payment</span>
                </button>
                <button className="px-4 py-2.5 rounded-lg text-on-surface-variant font-label-lg text-label-lg flex items-center gap-1.5 hover:text-on-surface transition-all ml-auto" type="button">
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  <span>Export Consular PDF</span>
                </button>
              </div>
            </div>

            {/* SECTION B: Voxide Voice Assistant */}
            <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-[0_2px_12px_rgba(30,41,59,0.04)] flex flex-col gap-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary">Voxide Voice Assistant</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Ask anything about your rights or contract terms</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-md text-label-md">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  Audio AI Ready
                </span>
              </div>
              
              <div id="mic-zone" className="p-6 rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer hover:bg-surface-container transition-all" onClick={toggleListening}>
                <div className="flex items-center gap-4">
                  <button 
                    id="main-mic-btn"
                    aria-label="Start Voice Recording" 
                    className={`w-16 h-16 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center shadow-md transition-all ${isListening ? 'scale-110' : 'hover:scale-105 active:scale-95'}`}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleListening(); }}
                  >
                    <span className="material-symbols-outlined text-[32px]">mic</span>
                  </button>
                  <div className="flex flex-col">
                    <span id="mic-status-title" className="font-headline-sm text-headline-sm text-primary">{micStatus}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">English audio voice assistant is ready to listen</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 h-10 px-4 py-2 bg-surface-container-lowest rounded-lg">
                  <span className="w-1 h-3 bg-secondary-container rounded-full animate-pulse"></span>
                  <span className="w-1 h-6 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-8 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                  <span className="w-1 h-4 bg-secondary-container rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></span>
                  <span className="w-1 h-7 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                  <span className="w-1 h-2 bg-surface-tint rounded-full"></span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Quick One-Click Inquiries</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={handlePresetClick} className="voice-preset p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-left flex items-start gap-2.5 transition-all" type="button">
                    <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">help_outline</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface">Overtime Clause</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Review extra hours compensation</span>
                    </div>
                  </button>
                  <button onClick={handlePresetClick} className="voice-preset p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-left flex items-start gap-2.5 transition-all" type="button">
                    <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">gavel</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface">Labor Law Rights</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Official domestic worker protections</span>
                    </div>
                  </button>
                  <button onClick={handlePresetClick} className="voice-preset p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-left flex items-start gap-2.5 transition-all" type="button">
                    <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">rate_review</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface">Agency Rating</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Check broker compliance record</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* SECTION C: Safety Check-in & Guardians */}
            <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-[0_2px_12px_rgba(30,41,59,0.04)] flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Guardians & Check-in</h2>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">Weekly Cadence</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-label-md text-primary font-bold">1</div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface">Family Emergency Link</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Mother & Brother (Addis Ababa)</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">check_circle</span>
                </div>
                
                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-label-md text-primary font-bold">2</div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface">Local Safe Cell Community</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Riyadh Domestic Workers Circle</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">check_circle</span>
                </div>
                
                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-label-md text-primary font-bold">3</div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface">Ethiopian Embassy Consular Desk</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">+966 11 482 8411 (Diplomatic line)</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">check_circle</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-surface-tint text-[20px]">notifications_active</span>
                  <span className="font-body-sm text-body-sm text-on-surface">Next automated ping alert in <strong className="text-primary font-semibold">3 days</strong></span>
                </div>
                <button className="font-label-md text-label-md text-primary hover:underline" type="button">Settings</button>
              </div>
            </div>

            {/* SECTION D: Trust Registry Search */}
            <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-[0_2px_12px_rgba(30,41,59,0.04)] flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Trust Registry Search</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Verify licensed recruiters and employers</p>
                </div>
              </div>
              
              <div className="relative flex items-center">
                <input id="agency-search-input" className="w-full h-12 pl-11 pr-24 rounded-lg bg-surface-container-low text-on-surface font-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container transition-all" placeholder="Search agency or employer license..." type="text" />
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">search</span>
                <button id="btn-search-registry" className="absolute right-1.5 px-3 py-1.5 rounded-md bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all" type="button">
                  Search
                </button>
              </div>
              
              <div className="p-4 rounded-xl bg-error-container/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-[20px] mt-0.5">warning</span>
                <div className="flex flex-col gap-1">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Recent Council Verdict</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    <strong className="text-on-surface">Al-Barakah Agency</strong> placed on 3-month probation due to unverified salary fee deductions reported by 4 workers.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION E: Worker Governance Council */}
            <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-[0_2px_12px_rgba(30,41,59,0.04)] flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary">Worker Governance Council</h2>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Active Term 4 · Peer-Led Accountability</span>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-on-tertiary-container bg-surface-container-low px-2.5 py-1 rounded-full">12 Active Reps</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Have a dispute, unfair contract modification, or inquiry? Speak directly with a verified female community representative assigned to your sector.
              </p>
              <div className="flex items-center justify-between pt-1">
                <button className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all flex items-center gap-2" type="button">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  <span>Contact Representative</span>
                </button>
                <a className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface" href="#">View Decisions</a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM DISCREET BAR */}
        <footer className="mt-4 p-5 rounded-xl bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">keyboard</span>
            <span className="font-body-sm text-body-sm">Press <kbd className="px-2 py-0.5 rounded bg-surface-container-lowest font-semibold text-on-surface text-label-md">ESC</kbd> anytime for immediate Quick Disguise</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface">
            <span className="material-symbols-outlined text-error text-[20px]">phone_in_talk</span>
            <span className="font-body-sm text-body-sm">24/7 Consular Emergency Assistance Hotline: <strong className="font-semibold">+966 11 482 8411</strong></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
