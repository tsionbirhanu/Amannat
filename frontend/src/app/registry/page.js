export const metadata = {
  title: 'Trust Registry | Amannat',
};

export default function RegistryPage() {
  return (
    <div>
      <h1 className="page-title">Trust Registry</h1>
      <p className="page-description">Verified history on agencies and employers.</p>
      
      <div className="glass" style={{ padding: '2rem' }}>
        <h2>Search</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search agency by name or license number..." 
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: 'none', 
              background: 'rgba(0,0,0,0.2)', 
              color: 'white' 
            }} 
          />
          <button className="btn btn-primary">Search</button>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Recent Reports</h3>
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <p style={{ color: '#f8fafc', fontWeight: 'bold' }}>Agency Al-Aman</p>
            <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>Flag: 3 wage-related reports in the last 6 months.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
