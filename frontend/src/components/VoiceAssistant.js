'use client';
import { useState } from 'react';

export default function VoiceAssistant() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="voice-assistant-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      <button 
        className="btn btn-primary" 
        style={{ 
          borderRadius: '50%', 
          width: '60px', 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: isActive ? '0 0 15px 5px rgba(59, 130, 246, 0.6)' : '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }}
        onClick={() => setIsActive(!isActive)}
        title="Voice Assistant (Voxide)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </button>
      
      {isActive && (
        <div className="glass" style={{ position: 'absolute', bottom: '80px', right: '0', padding: '1rem', width: '250px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Voice Assistant Active</h3>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Listening for commands in Amharic, Oromiffa, or English...</p>
        </div>
      )}
    </div>
  );
}
