export const metadata = {
  title: 'Portable Worker Record | Amannat',
};

export default function RecordPage() {
  return (
    <div>
      <h1 className="page-title">Portable Worker Record</h1>
      <p className="page-description">Your contract, wage history, and emergency information.</p>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <h2 style={{ margin: 0 }}>Current Contract</h2>
            <span className="status-verified">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              Verified
            </span>
          </div>
          <button className="btn" style={{ backgroundColor: '#e2e8f0', color: 'var(--primary-color)' }}>Export PDF</button>
        </div>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--space-md)' }}>Upload a photo or dictate your contract terms to extract details automatically.</p>
        
        <div style={{ padding: 'var(--space-lg)', border: '1.5px dashed var(--border-medium)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <p style={{ marginBottom: 'var(--space-md)' }}>No active contract found.</p>
          <button className="btn btn-primary">
            Add Contract
            <span aria-hidden="true" style={{ opacity: 0.7 }}>🔊</span>
          </button>
        </div>
      </div>
    </div>
  );
}
