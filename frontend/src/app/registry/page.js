export const metadata = {
  title: 'Trust Registry | Amannat',
};

export default function RegistryPage() {
  return (
    <div>
      <h1 className="page-title">Trust Registry</h1>
      <p className="page-description">Verified history on agencies and employers.</p>
      
      <div className="card">
        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Search</h2>
        
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Search agency by name or license number..." 
          />
          <button className="btn btn-voice" aria-label="Dictate search query" style={{ minWidth: '52px', padding: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          </button>
          <button className="btn btn-primary">Search</button>
        </div>
        
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Recent Reports</h3>
          
          <div style={{ padding: 'var(--space-md)', background: 'var(--surface-container-low)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
              <p style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Agency Al-Aman</p>
              <div className="audio-pill">
                ▶ 0:42 • አማርኛ
              </div>
            </div>
            <p style={{ color: 'var(--emergency-color)', fontSize: '14px', fontWeight: '500' }}>
              <span aria-hidden="true">⚠️</span> Flag: 3 wage-related reports in the last 6 months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
