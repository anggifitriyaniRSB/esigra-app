import React from 'react';

export default function PrototypePage() {
  return (
    <div style={{ width: '100%', height: '100vh', border: 'none' }}>
      <iframe 
        src="https://esigra-prototype.vercel.app" 
        title="e-SIGRA Prototype"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
