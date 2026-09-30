'use client';
import { useState, useEffect } from 'react';

export default function ContractAndWagesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm mb-space-xs">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Sovereign Vault • Ledger Node #ET-SA-882</span>
          </div>
          <h1 className="font-display text-display text-primary tracking-tight">Contract & Wages</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Portable employment record, digital contract vault, and verified wage ledger</p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <button onClick={() => displayToast('Compiling consular proof dossier (PDF)... Download starting.')} className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-low shadow-sm transition-all font-label-lg text-label-lg min-h-[48px]" type="button">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">download_for_offline</span>
            <span>Export Consular PDF</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md transition-all font-label-lg text-label-lg min-h-[48px]" type="button">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>+ Log Payment</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-space-md">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Total Contract Due</span>
              <span className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </span>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-primary tracking-tight">12,000 <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">SAR</span></div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                8 Months Cumulative Accrual
              </p>
            </div>
            <div className="mt-space-md w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-space-md">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Wages Received</span>
              <span className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-tertiary-container">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </span>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-primary tracking-tight">10,500 <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">SAR</span></div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                7 Payments Confirmed
              </p>
            </div>
            <div className="mt-space-md w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className="bg-on-tertiary-container h-full rounded-full" style={{ width: '87.5%' }}></div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-space-md">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Outstanding Balance</span>
              <span className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              </span>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-primary tracking-tight">1,500 <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">SAR</span></div>
              <div className="mt-space-xs inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container font-label-md text-[12px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                October 2024 overdue by 16 days
              </div>
            </div>
            <div className="mt-space-md w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className="bg-secondary-container h-full rounded-full" style={{ width: '12.5%' }}></div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-space-md">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Contract Term</span>
              <span className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </span>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-primary tracking-tight">16 <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">Months Left</span></div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">event_available</span>
                Ends March 2026 (24 mo standard)
              </p>
            </div>
            <div className="mt-space-md w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '33.3%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md mb-space-lg gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">policy</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary tracking-tight">Verified Digital Contract</h2>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Authenticated via Ministry of Human Resources (Musaned Node)</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-label-md font-semibold self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Legally Binding
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md p-space-md rounded-xl bg-surface-container-low mb-space-lg">
                <div className="flex flex-col gap-0.5">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Sponsoring Employer</span>
                  <span className="font-headline-sm text-[16px] text-primary">Al-Mansoor Family</span>
                  <span className="font-body-sm text-[13px] text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">location_on</span>
                    Riyadh, Al-Malaz District, Kingdom of Saudi Arabia
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Placement Agency</span>
                  <span className="font-headline-sm text-[16px] text-primary">Ethio-Gulf Bilateral Agency</span>
                  <span className="font-body-sm text-[13px] text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-on-tertiary-container">stars</span>
                    Grade A Diplomatic Credential • Lic #ET-8834
                  </span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm">Mandated Terms & Conditions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-lg">
                <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium block">Monthly Wage</span>
                    <span className="font-headline-sm text-[15px] text-primary block mt-0.5">1,500 SAR / month</span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug mt-1">Guaranteed direct electronic bank transfer due by the 30th of each month.</p>
                  </div>
                </div>
                <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium block">Weekly Rest</span>
                    <span className="font-headline-sm text-[15px] text-primary block mt-0.5">Every Friday</span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug mt-1">24-hour uninterrupted continuous rest with full liberty of communication.</p>
                  </div>
                </div>
                <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">bedtime</span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium block">Daily Working Hours</span>
                    <span className="font-headline-sm text-[15px] text-primary block mt-0.5">Maximum 10 hours / day</span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug mt-1">Includes mandatory 9-hour continuous nighttime rest with private room accommodation.</p>
                  </div>
                </div>
                <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium block">Termination Notice</span>
                    <span className="font-headline-sm text-[15px] text-primary block mt-0.5">30 Days Written Notice</span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug mt-1">Consular mediation mandatory before any repatriation or ticket cancellation.</p>
                  </div>
                </div>
              </div>
              <div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-sm mb-space-lg">
                <span className="material-symbols-outlined text-[22px] text-secondary shrink-0 mt-0.5">shield</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] text-on-secondary-container">Labor Law Protection Notice</span>
                  <p className="font-body-sm text-[13px] text-on-surface-variant mt-0.5 leading-relaxed">
                    Employer holding of worker's passport, mobile device, or national identity card is strictly prohibited under domestic labor regulations. Your passport remains legally in your personal custody at all times.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs">
                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-[13px]">
                  <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">lock</span>
                  <span>Cryptographically sealed record</span>
                </div>
                <button className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-surface-container hover:text-on-surface transition-colors font-label-lg text-label-lg" type="button">
                  <span>View Full Contract Clauses</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-sm">
              <div className="flex items-center justify-between mb-space-lg">
                <div>
                  <h2 className="font-headline-md text-headline-md text-primary tracking-tight">Recent Wage Disbursements</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Immutable monthly payment records recorded on worker ledger</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
                  <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                  <span>Ledger In-Sync</span>
                </div>
              </div>
              <div className="flex flex-col gap-space-sm">
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:shadow-sm transition-all">
                  <div className="flex items-center gap-space-md">
                    <div className="w-11 h-11 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-headline-sm text-primary">October 2024</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container font-label-md text-[11px] font-semibold">Overdue (16d)</span>
                      </div>
                      <span className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">Automated SMS reminder dispatched to sponsor</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between pl-14 sm:pl-0">
                    <span className="font-headline-sm text-headline-sm text-secondary">1,500 SAR</span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant font-medium">Pending Settlement</span>
                  </div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:shadow-sm transition-all">
                  <div className="flex items-center gap-space-md">
                    <div className="w-11 h-11 rounded-xl bg-surface-container-high text-on-tertiary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-headline-sm text-primary">September 2024</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-[11px] font-semibold">Confirmed</span>
                      </div>
                      <span className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">Direct Transfer via Alinma Bank • Ref #TRX-99402</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between pl-14 sm:pl-0">
                    <span className="font-headline-sm text-headline-sm text-primary">1,500 SAR</span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">Cleared Sep 30, 2024</span>
                  </div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:shadow-sm transition-all">
                  <div className="flex items-center gap-space-md">
                    <div className="w-11 h-11 rounded-xl bg-surface-container-high text-on-tertiary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">receipt</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-headline-sm text-primary">August 2024</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-[11px] font-semibold">Confirmed</span>
                      </div>
                      <span className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">Physical Cash with Countersigned Receipt & Photo Vault</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between pl-14 sm:pl-0">
                    <span className="font-headline-sm text-headline-sm text-primary">1,500 SAR</span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">Cleared Aug 31, 2024</span>
                  </div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:shadow-sm transition-all">
                  <div className="flex items-center gap-space-md">
                    <div className="w-11 h-11 rounded-xl bg-surface-container-high text-on-tertiary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-headline-sm text-primary">July 2024</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-[11px] font-semibold">Confirmed</span>
                      </div>
                      <span className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">Direct Transfer via Alinma Bank • Ref #TRX-87140</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between pl-14 sm:pl-0">
                    <span className="font-headline-sm text-headline-sm text-primary">1,500 SAR</span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">Cleared Jul 30, 2024</span>
                  </div>
                </div>
              </div>
              <div className="mt-space-lg pt-space-md flex items-center justify-between text-on-surface-variant">
                <span className="font-body-sm text-body-sm">Showing last 4 entries • 4 prior archive entries encrypted in vault</span>
                <button className="font-label-md text-label-md text-primary font-semibold hover:underline" type="button">View Complete Ledger History</button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight">Emergency & Guardian Roster</h2>
                <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">Pre-configured escalation chain for wage disputes and safety alerts</p>
              <div className="flex flex-col gap-space-sm">
                <div className="p-space-md rounded-xl bg-surface-container-low flex items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-[13px] shrink-0 mt-0.5">1</div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-[15px] text-primary">Almaz Bekele</span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">(Mother)</span>
                      </div>
                      <span className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">Direct Voice Phone & SMS</span>
                      <span className="font-label-md text-[13px] text-primary font-mono mt-0.5">+251 91 124 5589</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-[11px] font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                    Active
                  </span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-[13px] shrink-0 mt-0.5">2</div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-[15px] text-primary">Dawit Tadesse</span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">(Brother)</span>
                      </div>
                      <span className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">WhatsApp Encrypted Backup</span>
                      <span className="font-label-md text-[13px] text-primary font-mono mt-0.5">+251 92 841 0932</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-[11px] font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                    Active
                  </span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-[13px] shrink-0 mt-0.5">3</div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-[15px] text-primary">Local Safe Cell Community</span>
                      </div>
                      <span className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">Riyadh Domestic Workers Peer Circle</span>
                      <span className="font-label-md text-[12px] text-on-surface-variant mt-0.5">Geofenced mutual protection cluster</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-[11px] font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                    Active
                  </span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-[13px] shrink-0 mt-0.5">4</div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-[15px] text-primary">Ethiopian Embassy Consular Desk</span>
                      </div>
                      <span className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">Diplomatic Assistance & Labor Attaché</span>
                      <span className="font-label-md text-[13px] text-primary font-mono mt-0.5">+966 11 482 8411</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-md text-[11px] font-semibold shrink-0">
                    <span className="material-symbols-outlined text-[13px] text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Verified
                  </span>
                </div>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between">
                <span className="font-body-sm text-[12px] text-on-surface-variant">Escalates after 30 days of wage non-payment</span>
                <button className="text-primary font-label-md text-[13px] hover:underline font-semibold" type="button">+ Configure Chain</button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-space-sm mb-space-sm">
                  <span className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                  </span>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary tracking-tight">Consular & Legal Evidence Export</h2>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">Certified Sovereign Proof</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-lg">
                  Generate an official tamper-proof statement of your verified wage receipts and contract terms, certified for labor attachés, consular legal aid officers, and dispute mediation hearings.
                </p>
                <div className="p-space-md rounded-xl bg-surface-container-low mb-space-lg flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-on-surface-variant font-body-sm">Document Stamp:</span>
                    <span className="font-mono text-primary font-medium">SHA-256 Verified Seal</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-on-surface-variant font-body-sm">Format:</span>
                    <span className="text-primary font-body-sm font-medium">Bilingual PDF (English / Amharic)</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-on-surface-variant font-body-sm">Included Records:</span>
                    <span className="text-primary font-body-sm font-medium">Contract Terms + 8 Month Audit</span>
                  </div>
                </div>
              </div>
              <button onClick={() => displayToast('Official consular certified statement exported successfully.')} className="w-full inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md transition-all font-label-lg text-label-lg min-h-[48px]" type="button">
                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                <span>Download Official Statement (PDF)</span>
              </button>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-[13px] text-primary">Offline Offline-First Vault</span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant">Cached locally on device for no-signal scenarios</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container" title="Vault Online"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Toasts */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm ${isModalOpen ? '' : 'hidden'}`}>
        <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-xl shadow-xl flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-primary">Record Wage Disbursement</h3>
            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low" type="button">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Log payment received for October 2024 to reconcile your balance.</p>
          <div className="flex flex-col gap-space-sm">
            <label className="font-label-md text-label-md text-primary">Disbursement Amount (SAR)</label>
            <input className="h-12 px-4 rounded-lg bg-surface-container-low text-primary font-headline-sm text-headline-sm focus:outline-none" type="number" defaultValue="1500" />
          </div>
          <div className="flex flex-col gap-space-sm">
            <label className="font-label-md text-label-md text-primary">Payment Channel</label>
            <select className="h-12 px-4 rounded-lg bg-surface-container-low text-primary font-body-md text-body-md focus:outline-none">
              <option>Direct Bank Transfer (Alinma / Al Rajhi)</option>
              <option>Cash with Written Signature</option>
              <option>Remittance Wire Service</option>
            </select>
          </div>
          <div className="flex items-center gap-space-sm mt-space-sm">
            <button onClick={() => { setIsModalOpen(false); displayToast('October 2024 payment logged and signed to ledger.'); }} className="flex-1 py-3 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg min-h-[48px] hover:bg-primary-container" type="button">
              Save Verified Entry
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-space-md py-3 rounded-xl shadow-lg flex items-center gap-3 transition-opacity duration-300 ${showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-on-tertiary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <span className="font-body-sm text-body-sm text-on-primary">{toastMessage}</span>
      </div>
    </div>
  );
}
