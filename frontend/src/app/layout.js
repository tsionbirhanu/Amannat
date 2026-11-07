import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import VoxideSession from "@/components/VoxideSession";

export const metadata = {
  title: "Amannat",
  description: "Worker Safety & Trust",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Latin UI font + Ethiopic (Amharic, Afaan Oromo) and Arabic fallbacks */}
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&family=Noto+Sans+Ethiopic:wght@400..700&family=Noto+Sans+Arabic:wght@400..700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-sand-50 font-sans text-stone-900 antialiased">
        <LanguageProvider>
          <div className="w-full min-h-screen">
            {children}
          </div>
          <VoxideSession />
        </LanguageProvider>
      </body>
    </html>
  );
}
