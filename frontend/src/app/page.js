export const metadata = {
  title: 'Amannat | Dashboard',
};

export default function Home() {
  return (
    <div className="dashboard">
      <h1 className="page-title">Welcome to Amannat</h1>
      <p className="page-description">Your sovereign safety and trust platform.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        <div className="card">
          <h2>Check Your Record</h2>
          <p style={{ margin: 'var(--space-sm) 0 var(--space-md) 0', color: 'var(--on-surface-variant)' }}>View your contract terms, wage history, and important documents.</p>
          <a href="/record" className="btn btn-primary">
            Go to Record
            <span aria-hidden="true" style={{ opacity: 0.7 }}>🔊</span>
          </a>
        </div>
        
        <div className="card">
          <h2>Trust Registry</h2>
          <p style={{ margin: 'var(--space-sm) 0 var(--space-md) 0', color: 'var(--on-surface-variant)' }}>Search agencies and employers for verified past histories and flags.</p>
          <a href="/registry" className="btn btn-primary">
            Search Registry
            <span aria-hidden="true" style={{ opacity: 0.7 }}>🔊</span>
          </a>
        </div>
        
        <div className="card" style={{ border: '1.5px solid var(--emergency-color)' }}>
          <h2 style={{ color: 'var(--emergency-color)' }}>Safety Options</h2>
          <p style={{ margin: 'var(--space-sm) 0 var(--space-md) 0', color: 'var(--on-surface-variant)' }}>Set up check-ins, alert contacts, or use the emergency panic button.</p>
          <a href="/safety" className="btn btn-danger">
            Safety Tools
            <span aria-hidden="true" style={{ opacity: 0.7 }}>🔊</span>
          </a>
        </div>
      </div>
    </div>
  );
}
