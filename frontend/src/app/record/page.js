export const metadata = {
  title: 'Portable Worker Record | Amannat',
};

export default function RecordPage() {
  return (
    <div>
      <h1 className="page-title">Portable Worker Record</h1>
      <p className="page-description">Your contract, wage history, and emergency information, available anywhere.</p>
      
      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Current Contract</h2>
          <button className="btn btn-primary" style={{ backgroundColor: 'var(--accent-color)' }}>Export PDF</button>
        </div>
        <p style={{ color: '#94a3b8' }}>Upload a photo or dictate your contract terms to extract details automatically.</p>
        
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center' }}>
          <p>No active contract found.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Contract</button>
        </div>
      </div>
    </div>
  );
}
