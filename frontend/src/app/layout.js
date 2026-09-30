import Navigation from '../components/Navigation';
import VoiceAssistant from '../components/VoiceAssistant';
import './globals.css';

export const metadata = {
  title: 'Amannat | Worker Safety & Trust',
  description: 'A worker-owned digital safety and trust platform for migrant domestic workers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <VoiceAssistant />
      </body>
    </html>
  );
}
