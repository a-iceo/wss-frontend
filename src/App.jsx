import React, { useState, useEffect } from 'react';

const API_URL = 'https://wss-backend.onrender.com/api';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/matches`);
      if (!response.ok) throw new Error('Error fetching matches');
      const data = await response.json();
      setMatches(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        ⚽ World Stream Soccer
      </h1>
      
      {loading && <p style={{ textAlign: 'center' }}>Cargando partidos...</p>}
      {error && <p style={{ textAlign: 'center', color: '#ff6b6b' }}>Error: {error}</p>}
      
      {!loading && matches.length === 0 && (
        <p style={{ textAlign: 'center' }}>No hay partidos disponibles</p>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {matches.map((match, idx) => (
          <div key={idx} style={{
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#1a1a2e',
            transition: 'transform 0.2s'
          }}>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>
              {match.league || 'Liga'}
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
              {match.home} vs {match.away}
            </p>
            <p style={{ textAlign: 'center', color: '#00ff00', marginTop: '10px' }}>
              {match.score || 'Próximo'}
            </p>
            <button onClick={fetchMatches} style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#6c5ce7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}>
              Ver Stream
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
