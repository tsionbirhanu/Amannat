import Link from 'next/link';

export default function Navigation() {
  return (
    <header className="nav-container glass">
      <div className="logo">
        <Link href="/">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Amannat</h1>
        </Link>
      </div>
      <nav className="nav-links">
        <Link href="/record">Record</Link>
        <Link href="/registry">Registry</Link>
        <Link href="/safety">Safety</Link>
        <Link href="/council">Council</Link>
      </nav>
    </header>
  );
}
