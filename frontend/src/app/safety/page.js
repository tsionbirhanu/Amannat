export const metadata = {
  title: 'Safety & Reporting | Amannat',
};

export default function SafetyPage() {
  return (
    <div>
      <h1 className="page-title">Safety & Reporting</h1>
      <p className="page-description">Check-ins, escalations, and guided access to help.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        <div className="card">
          <h2>Scheduled Check-ins</h2>
          <p style={{ margin: 'var(--space-sm) 0 var(--space-md) 0', color: 'var(--on-surface-variant)' }}>Set a schedule to confirm you are safe. Missing two check-ins alerts your contacts.</p>
          <button className="btn btn-primary" style={{ width: '100%' }}>
            Set Check-in Schedule
            <span aria-hidden="true" style={{ opacity: 0.7 }}>🔊</span>
          </button>
        </div>
        
        <div className="card" style={{ border: '2px solid var(--emergency-color)' }}>
          <h2 style={{ color: 'var(--emergency-color)' }}>Emergency Actions</h2>
          <p style={{ margin: 'var(--space-sm) 0 var(--space-lg) 0', color: 'var(--on-surface-variant)' }}>Share your last known location instantly with guardian contacts.</p>
          <button 
            className="btn btn-danger" 
            style={{ width: '100%', minHeight: '64px', fontSize: '18px' }}
          >
            PANIC BUTTON
          </button>
          
          <button className="btn" style={{ marginTop: 'var(--space-md)', width: '100%', background: 'var(--surface-container-low)', color: 'var(--on-surface)', border: '1px solid var(--border-medium)' }}>
            Quick Exit Disguise
          </button>
        </div>
      </div>
    </div>
  );
}
