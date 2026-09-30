export const metadata = {
  title: 'Governance Council | Amannat',
};

export default function CouncilPage() {
  return (
    <div>
      <h1 className="page-title">Governance Council</h1>
      <p className="page-description">Registry moderation and policy votes run by elected worker representatives.</p>
      
      <div className="card">
        <h2>Council Members</h2>
        <p style={{ margin: 'var(--space-sm) 0 var(--space-md) 0', color: 'var(--on-surface-variant)' }}>View active council members and their terms.</p>
        
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Recent Decisions</h3>
          
          <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <li style={{ padding: 'var(--space-md)', background: 'var(--surface-container-low)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                <strong style={{ color: 'var(--primary-color)' }}>Policy Update</strong>
                <div className="audio-pill">
                  ▶ 0:15 • English
                </div>
              </div>
              <p style={{ color: 'var(--on-surface-variant)' }}>Standardized wage delay threshold to 15 days.</p>
            </li>
            
            <li style={{ padding: 'var(--space-md)', background: 'var(--surface-container-low)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                <strong style={{ color: 'var(--primary-color)' }}>Appeal Review</strong>
                <div className="audio-pill">
                  ▶ 0:30 • አማርኛ
                </div>
              </div>
              <p style={{ color: 'var(--on-surface-variant)' }}>Agency XYZ appeal denied (Majority decision).</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
