'use client';
import { useState } from 'react';

export default function VoiceAssistant() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="bottom-actions">
      {isActive && (
        <div className="elevated" style={{ padding: '1rem', width: '250px', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Voice Assistant</h3>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Listening for commands in Amharic, Oromiffa, or English...</p>
        </div>
      )}

      <button 
        className="btn btn-voice" 
        style={{ 
          width: '64px', 
          height: '64px', 
          padding: 0, 
          boxShadow: isActive ? '0 0 0 4px rgba(254, 243, 199, 0.5)' : '0 6px 16px -2px rgba(30, 41, 59, 0.08)',
          alignSelf: 'flex-end'
        }}
        onClick={() => setIsActive(!isActive)}
        title="Voice Assistant (Voxide)"
        aria-label="Voice Assistant"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </button>
    </div>
  );
}
