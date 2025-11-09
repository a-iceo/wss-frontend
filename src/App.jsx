import React, { useState, useEffect } from 'react';

const API_URL = 'https://wss-backend.onrender.com/api';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [playingStream, setPlayingStream] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`);
      const data = await response.json();
      // Add YouTube embed IDs to matches
      const enrichedData = data.map((match, idx) => ({
        ...match,
        youtubeId: ['_w3t5s4s7sU', 'jL2K9Hs5c9Q', 'k5L3N7m9p1R'][idx] // Sample video IDs
      }));
      setMatches(enrichedData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const playStream = (match, source) => {
    setPlayingStream({
      match: match,
      source: source,
      videoId: match.youtubeId
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#fff', background: '#0f1729', minHeight: '100vh' }}>Cargando partidos...</div>;

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
              border: '2px solid #764ba2'
            }}
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

      {selectedMatch && !playingStream && (
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
            maxWidth: '500px',
            color: '#fff',
            border: '2px solid #667eea'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: '0' }}>{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</h2>
            <p style={{ color: '#888', marginBottom: '20px' }}>Selecciona plataforma para reproducir:</p>
            
            {selectedMatch.streamingLinks && selectedMatch.streamingLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => playStream(selectedMatch, link.name)}
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
                {link.name} - REPRODUCIR
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
              Cancelar
            </button>
          </div>
        </div>
      )}

      {playingStream && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '2000',
          flexDirection: 'column',
          padding: '20px'
        }}
        >
          <button
            onClick={() => setPlayingStream(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px 20px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              zIndex: '2001'
            }}
          >
            ✕ Cerrar
          </button>

          <div style={{
            width: '100%',
            maxWidth: '900px',
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <iframe
              width="100%"
              height="600"
              src={`https://www.youtube.com/embed/${playingStream.videoId}?autoplay=1`}
              title={`${playingStream.match.homeTeam} vs ${playingStream.match.awayTeam}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            ></iframe>
          </div>

          <div style={{
            textAlign: 'center',
            color: '#fff',
            maxWidth: '900px',
            width: '100%'
          }}>
            <h2>{playingStream.match.homeTeam} vs {playingStream.match.awayTeam}</h2>
            <p style={{ color: '#888' }}>Reproduciendo en: {playingStream.source}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Estos son videos highlhights oficiales disponibles en YouTube</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
