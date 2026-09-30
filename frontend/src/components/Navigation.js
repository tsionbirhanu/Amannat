import Link from 'next/link';

export default function Navigation() {
  return (
    <header className="nav-container">
      <div className="logo">
        <Link href="/">
          <h1 style={{ fontSize: '20px', color: '#ffffff', margin: 0 }}>Amannat</h1>
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
