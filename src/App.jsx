import React, { useState, useEffect } from 'react';

const API_URL = 'https://wss-backend.onrender.com/api';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`);
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const openStream = (url) => {
    window.open(url, '_blank');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando partidos...</div>;

  return (
    <div style={{ background: '#0f1729', minHeight: '100vh', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>⚽ World Stream Soccer</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {matches.map((match) => (
          <div
            key={match.id}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.3s',
              border: '2px solid #764ba2'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '10px' }}>
              {match.league.name}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>
                {match.homeTeam} <span style={{ color: '#4ade80' }}>VS</span> {match.awayTeam}
              </div>
            </div>

            {match.status === 'LIVE' && (
              <div style={{ background: '#ef4444', color: '#fff', padding: '8px', borderRadius: '6px', textAlign: 'center', marginBottom: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                🔴 EN VIVO
              </div>
            )}

            <button
              onClick={() => setSelectedMatch(match)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#4ade80',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '10px',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#22c55e'}
              onMouseLeave={(e) => e.target.style.background = '#4ade80'}
            >
              ▶ VER STREAM
            </button>
          </div>
        ))}
      </div>

      {selectedMatch && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000'
        }}
        onClick={() => setSelectedMatch(null)}
        >
          <div style={{
            background: '#1a1f35',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '400px',
            color: '#fff',
            border: '2px solid #667eea'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: '0' }}>{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</h2>
            <p style={{ color: '#888', marginBottom: '20px' }}>Selecciona una plataforma de streaming:</p>
            
            {selectedMatch.streamingLinks && selectedMatch.streamingLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => openStream(link.url)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  marginBottom: '10px',
                  background: '#667eea',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#764ba2'}
                onMouseLeave={(e) => e.target.style.background = '#667eea'}
              >
                {link.name}
              </button>
            ))}
            
            <button
              onClick={() => setSelectedMatch(null)}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '15px',
                background: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
