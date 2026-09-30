export const metadata = {
  title: 'Safety & Reporting | Amannat',
};

export default function SafetyPage() {
  return (
    <div>
      <h1 className="page-title">Safety & Reporting</h1>
      <p className="page-description">Check-ins, escalations, and guided access to help.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <h2>Scheduled Check-ins</h2>
          <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Set a schedule to confirm you are safe. Missing two check-ins alerts your contacts.</p>
          <button className="btn btn-primary">Set Check-in Schedule</button>
        </div>
        
        <div className="glass" style={{ padding: '2rem', border: '1px solid var(--danger-color)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--danger-color)' }}>Emergency Actions</h2>
          <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Share your last known location instantly with guardian contacts.</p>
          <button 
            className="btn btn-danger" 
            style={{ width: '100%', padding: '1.5rem', fontSize: '1.25rem', borderRadius: '12px' }}
          >
            PANIC BUTTON
          </button>
          
          <button className="btn" style={{ marginTop: '1rem', width: '100%', background: '#334155', color: 'white' }}>
            Quick Exit Disguise
          </button>
        </div>
      </div>
    </div>
  );
}
