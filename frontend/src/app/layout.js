import Link from 'next/link';
import Logo from '../components/Logo';
import './globals.css';

export const metadata = {
  title: 'Amannat | Worker Safety & Trust',
  description: 'A worker-owned digital safety and trust platform for migrant domestic workers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-body-md text-on-surface antialiased">
        
        <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-space-lg px-space-md">
          <div className="flex flex-col gap-space-lg">
            <div className="flex items-center gap-space-sm px-space-sm">
              <Logo className="h-8 w-8 object-contain" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight">Amannat</span>
                <span className="font-label-md text-label-md text-on-surface-variant font-normal">Worker Safety & Trust</span>
              </div>
            </div>
            
            <div className="h-px bg-surface-container-high mx-space-sm"></div>
            
            <nav className="flex flex-col gap-space-xs">
              <Link href="/" aria-current="page" className="flex items-center gap-space-md px-space-md py-space-sm transition-colors bg-primary-container text-on-primary font-label-lg rounded-xl shadow-[0_2px_6px_rgba(30,41,59,0.12)]">
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                <span>Dashboard</span>
              </Link>
              <Link href="/record" className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-lg text-label-lg">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                <span>Contract & Wages</span>
              </Link>
              <Link href="/registry" className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-lg text-label-lg">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span>Trust Registry</span>
              </Link>
              <Link href="#" className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-lg text-label-lg">
                <span className="material-symbols-outlined text-[20px]">mic</span>
                <span>Voice Assistant</span>
              </Link>
              <Link href="/safety" className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-lg text-label-lg">
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <span>Safety & SOS</span>
              </Link>
              <Link href="/council" className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-lg text-label-lg">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                <span>Governance Council</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex flex-col gap-space-sm px-space-sm">
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-on-tertiary-container">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span className="font-label-md text-label-md">Encrypted Vault</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Sovereign ledger data protected by decentral protocol.</p>
            </div>
          </div>
        </aside>

        <div className="pl-72 flex flex-col min-h-screen">
          <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
            <div className="flex items-center gap-space-md">
              <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-low">
                <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-pulse"></span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Ethiopia to Gulf Corridor:</span>
                <span className="font-label-md text-label-md text-on-tertiary-container font-semibold">Verified Safe</span>
              </div>
            </div>
            
            <div className="flex items-center gap-space-md">
              <button className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors" title="Quick Disguise Exit" type="button">
                <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
                <span className="font-label-md text-label-md">Quick Exit</span>
              </button>
              <button aria-label="Notifications" className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative" type="button">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span>
              </button>
              
              <div className="h-6 w-px bg-surface-container-high"></div>
              
              <div className="flex items-center gap-space-sm pl-space-xs">
                <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1XR3WrizV34dtDqvymGzZtMBON2eWORh-gqP_wKAGp0ThxE0gI-i7CgfG1i7i94Ypg9ZVAQX8BCcK0mrlYZLPlaN3mE8Fot4I86nXXSbagAlRQ4DaQiL4pVZDXBKVgEtFeU5LsXPr9wfKonAbX0OfdqIXZx39DiPwi-ADCQcNHJXwa9pGTtpa5MUFwP8UUDaRtR1HPpH_Vub8BMxd2ZzrVkufgqdzseJ5dTE1eT1gQpZKEkqbiiBbLSdck" />
                <div className="flex flex-col text-left">
                  <span className="font-label-lg text-label-lg text-on-surface leading-tight">Bethlehem T.</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Verified Worker</span>
                </div>
              </div>
            </div>
          </header>
          
          <main className="w-full pt-16 bg-surface flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
