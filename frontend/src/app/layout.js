import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata = {
  title: "Amannat",
  description: "Worker Safety & Trust",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&family=Plus+Jakarta+Sans:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased">
        <LanguageProvider>
          <div className="w-full min-h-screen">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
