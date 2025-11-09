import React, { useState, useEffect } from 'react';

const API_URL = 'https://wss-backend.onrender.com/api';

const mockMatches = [
  {
    id: 1,
    date: '2025-11-09T20:00:00Z',
    status: 'SCHEDULED',
    league: { id: 39, name: 'Premier League', country: 'England' },
    home_team: { id: 33, name: 'Manchester United' },
    away_team: { id: 50, name: 'Manchester City' },
    goals: { home: null, away: null },
    venue: 'Old Trafford',
    streams: [
      { name: 'Stream 1 HD', url: 'https://stream.example.com/stream1', quality: '1080p' },
      { name: 'Stream 2 SD', url: 'https://stream.example.com/stream2', quality: '720p' }
    ]
  },
  {
    id: 2,
    date: '2025-11-09T19:30:00Z',
    status: 'SCHEDULED',
    league: { id: 39, name: 'Premier League', country: 'England' },
    home_team: { id: 6, name: 'Liverpool' },
    away_team: { id: 35, name: 'Arsenal' },
    goals: { home: null, away: null },
    venue: 'Anfield',
    streams: [
      { name: 'Stream 1 HD', url: 'https://stream.example.com/stream1', quality: '1080p' },
      { name: 'Stream 2 SD', url: 'https://stream.example.com/stream2', quality: '720p' }
    ]
  },
  {
    id: 3,
    date: '2025-11-09T18:00:00Z',
    status: 'SCHEDULED',
    league: { id: 71, name: 'La Liga', country: 'Spain' },
    home_team: { id: 541, name: 'Real Madrid' },
    away_team: { id: 542, name: 'FC Barcelona' },
    goals: { home: null, away: null },
    venue: 'Santiago Bernabéu',
    streams: [
      { name: 'Stream 1 HD', url: 'https://stream.example.com/stream1', quality: '1080p' },
      { name: 'Stream 2 SD', url: 'https://stream.example.com/stream2', quality: '720p' }
    ]
  }
];

export default function App() {
  const [matches, setMatches] = useState(mockMatches);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/matches`);
      if (!response.ok) throw new Error('Backend error');
      const data = await response.json();
      setMatches(data.data || mockMatches);
    } catch (err) {
      console.log('Using mock data:', err.message);
      setMatches(mockMatches);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamClick = (match) => {
    setSelectedMatch(match);
  };

  const handleStreamSelect = (streamUrl) => {
    window.open(streamUrl, '_blank');
    setSelectedMatch(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#fff' }}>
        ⚽ World Stream Soccer
      </h1>

      {loading && <p style={{ textAlign: 'center', color: '#999' }}>Cargando...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {matches.map((match) => (
          <div key={match.id} style={{
            border: '2px solid #6c5ce7',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#1a1a2e',
            boxShadow: '0 4px 6px rgba(108, 92, 231, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <p style={{ fontSize: '12px', color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              {match.league?.name || 'Liga'}
            </p>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '15px' }}>
              {match.venue}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 }}>
                {match.home_team?.name}
              </p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#00ff00', margin: '0 15px' }}>
                VS
              </p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 }}>
                {match.away_team?.name}
              </p>
            </div>
            <button onClick={() => handleStreamClick(match)} style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#6c5ce7',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'background-color 0.3s'
            }} onMouseOver={(e) => e.target.style.backgroundColor = '#5d4fb8'} onMouseOut={(e) => e.target.style.backgroundColor = '#6c5ce7'}>
              ▶ VER STREAM
            </button>
          </div>
        ))}
      </div>

      {selectedMatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1a1a2e',
            border: '2px solid #6c5ce7',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            color: '#fff'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#00d4ff' }}>
              {selectedMatch.home_team?.name} vs {selectedMatch.away_team?.name}
            </h2>
            <p style={{ marginBottom: '20px', color: '#aaa' }}>
              Selecciona un stream:
            </p>
            {selectedMatch.streams?.map((stream, idx) => (
              <button key={idx} onClick={() => handleStreamSelect(stream.url)} style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: '#6c5ce7',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'background-color 0.3s'
              }} onMouseOver={(e) => e.target.style.backgroundColor = '#5d4fb8'} onMouseOut={(e) => e.target.style.backgroundColor = '#6c5ce7'}>
                ▶ {stream.name} ({stream.quality})
              </button>
            ))}
            <button onClick={() => setSelectedMatch(null)} style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              marginTop: '15px',
              backgroundColor: '#333',
              color: '#aaa',
              border: '1px solid #555',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
