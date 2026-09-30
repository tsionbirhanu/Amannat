export const metadata = {
  title: 'Governance Council | Amannat',
};

export default function CouncilPage() {
  return (
    <div>
      <h1 className="page-title">Governance Council</h1>
      <p className="page-description">Registry moderation and policy votes run by elected worker representatives.</p>
      
      <div className="glass" style={{ padding: '2rem' }}>
        <h2>Council Members</h2>
        <p style={{ margin: '1rem 0', color: '#94a3b8' }}>View active council members and their terms.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Recent Decisions</h3>
          <ul style={{ listStyleType: 'none', marginTop: '1rem' }}>
            <li style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1rem' }}>
              <strong>Policy Update:</strong> Standardized wage delay threshold to 15 days.
            </li>
            <li style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <strong>Appeal Review:</strong> Agency XYZ appeal denied (Majority decision).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
