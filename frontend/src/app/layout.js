import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&family=Plus+Jakarta+Sans:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased">
        <aside className="fixed left-0 top-0 bottom-0 w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col">
            <div className="h-20 px-space-lg flex items-center gap-space-sm">
              <img alt="Amannat logo emblem" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1XPgpnW5L30s9kLcYv4-89gsBXSdBQc0I60c6pdUZvyHphbLZ1Qu3WSM6zjnudJ0M2FnQUT4-y1JpLyK-5LmKMEChK2WGKX9DVkw55cFD-K-Po56HEhChlwRMxhCXhTm5KXe0iAv9acPMTrS0yr7XP7bz7ErRrwuge--vqO4yMtbsnRXpRf1tmQfVTk1RDcbyQ9wnqdnL-M9dHFaivoyWcVETD1jYkf6kAalC3Aa_2JlOK88lFAbPaRhw" />
              <div className="flex flex-col ml-space-xs">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight">Amannat</span>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">Worker Safety & Trust</span>
              </div>
            </div>
            <nav className="flex flex-col gap-space-xs px-space-md mt-space-sm">
              <Link href="/" className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-low hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                <span>Dashboard</span>
              </Link>
              <Link href="/record" aria-current="page" className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors bg-surface-container-low text-primary font-semibold">
                <span className="material-symbols-outlined text-[20px]">description</span>
                <span>Contract & Wages</span>
              </Link>
              <Link href="/registry" className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-low hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>Trust Registry</span>
              </Link>
              <Link href="/assistant" className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-low hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">mic</span>
                <span>Voice Assistant</span>
              </Link>
              <Link href="/safety" className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-low hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">fmd_bad</span>
                <span>Safety & SOS</span>
              </Link>
              <Link href="/council" className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-low hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">balance</span>
                <span>Governance Council</span>
              </Link>
            </nav>
          </div>
          <div className="p-space-md">
            <div className="bg-surface-container-low p-space-md rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-space-xs text-on-surface mb-space-xs">
                <span className="material-symbols-outlined text-[18px] text-on-surface">lock</span>
                <span className="font-headline-sm text-headline-sm text-[14px] text-on-surface font-semibold">Encrypted Vault</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-[12px]">Sovereign ledger data protected by decentral protocol.</p>
            </div>
          </div>
        </aside>

        <div className="pl-72 flex flex-col min-h-screen">
          <header className="fixed top-0 left-72 right-0 h-20 bg-surface-container-lowest/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-space-xl flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">Ethiopia to Gulf Corridor: Verified Safe</span>
              </div>
            </div>
            <div className="flex items-center gap-space-lg">
              <button className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-all" type="button">
                <span className="material-symbols-outlined text-[18px] text-error">bolt</span>
                <span className="font-body-sm text-body-sm text-on-surface">Quick Exit</span>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <div className="flex items-center gap-space-sm pl-space-sm">
                <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1XR3WrizV34dtDqvymGzZtMBON2eWORh-gqP_wKAGp0ThxE0gI-i7CgfG1i7i94Ypg9ZVAQX8BCcK0mrlYZLPlaN3mE8Fot4I86nXXSbagAlRQ4DaQiL4pVZDXBKVgEtFeU5LsXPr9wfKonAbX0OfdqIXZx39DiPwi-ADCQcNHJXwa9pGTtpa5MUFwP8UUDaRtR1HPpH_Vub8BMxd2ZzrVkufgqdzseJ5dTE1eT1gQpZKEkqbiiBbLSdck" />
                <div className="flex flex-col text-left">
                  <span className="font-headline-sm text-headline-sm text-[14px] text-on-surface leading-tight">Bethlehem T.</span>
                  <span className="font-label-md text-label-md text-on-surface-variant text-[12px]">Verified Worker</span>
                </div>
              </div>
            </div>
          </header>

          <main className="w-full pt-20 px-space-xl pb-16 flex-1 bg-background">
            {children}
          </main>

          <footer className="w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] py-space-sm px-space-xl flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">keyboard</span>
              <span>Press ESC anytime for immediate Quick Disguise</span>
            </div>
            <div className="flex items-center gap-space-xs text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
              <span className="font-body-sm text-body-sm text-on-surface font-medium">24/7 Consular Emergency Assistance Hotline: +966 11 482 8411</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
