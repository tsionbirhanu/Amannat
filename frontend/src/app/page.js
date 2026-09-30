export const metadata = {
  title: 'Amannat | Dashboard',
};

export default function Home() {
  return (
    <div className="dashboard">
      <h1 className="page-title">Welcome to Amannat</h1>
      <p className="page-description">Your portable safety and trust platform.</p>
      
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="card glass" style={{ padding: '2rem' }}>
          <h2>Check Your Record</h2>
          <p style={{ margin: '1rem 0', color: '#94a3b8' }}>View your contract terms, wage history, and important documents.</p>
          <a href="/record" className="btn btn-primary">Go to Record</a>
        </div>
        
        <div className="card glass" style={{ padding: '2rem' }}>
          <h2>Trust Registry</h2>
          <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Search agencies and employers for verified past histories and flags.</p>
          <a href="/registry" className="btn btn-primary">Search Registry</a>
        </div>
        
        <div className="card glass" style={{ padding: '2rem', border: '1px solid var(--danger-color)' }}>
          <h2>Safety Options</h2>
          <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Set up check-ins, alert contacts, or use the emergency panic button.</p>
          <a href="/safety" className="btn btn-danger">Safety Tools</a>
        </div>
      </div>
    </div>
  );
}
