import React, { useState, useEffect, useRef } from 'react';

const API_URL = 'https://wss-backend.onrender.com/api';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [playingStream, setPlayingStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (playingStream && videoRef.current && window.Hls) {
      const hls = new window.Hls();
      hls.loadSource(playingStream.streamUrl);
      hls.attachMedia(videoRef.current);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
        videoRef.current.play();
      });
    }
  }, [playingStream]);

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

  const playStream = (match, streamLink) => {
    setPlayingStream({
      match: match,
      platform: streamLink.name,
      streamUrl: streamLink.url
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#fff', background: '#0f1729', minHeight: '100vh' }}>Cargando partidos...</div>;

  return (
    <div style={{ background: '#0f1729', minHeight: '100vh', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>⚽ World Stream Soccer - LIVE M3U8 Streaming</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {matches.map((match) => (
          <div key={match.id} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '2px solid #764ba2'
          }}>
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
            <button onClick={() => setSelectedMatch(match)} style={{
              width: '100%', padding: '12px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
            }}>
              ▶ VER STREAM EN VIVO
            </button>
          </div>
        ))}
      </div>

      {selectedMatch && !playingStream && (
        <div style={{
          position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000'
        }} onClick={() => setSelectedMatch(null)}>
          <div style={{
            background: '#1a1f35', borderRadius: '12px', padding: '30px', maxWidth: '500px', color: '#fff', border: '2px solid #667eea'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: '0' }}>{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</h2>
            <p style={{ color: '#888', marginBottom: '20px' }}>Selecciona un stream en vivo:</p>
            {selectedMatch.streamingLinks && selectedMatch.streamingLinks.map((link, idx) => (
              <button key={idx} onClick={() => playStream(selectedMatch, link)} style={{
                display: 'block', width: '100%', padding: '12px', marginBottom: '10px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
              }}>
                {link.name} - REPRODUCIR STREAM
              </button>
            ))}
            <button onClick={() => setSelectedMatch(null)} style={{
              width: '100%', padding: '10px', marginTop: '15px', background: '#444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
            }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {playingStream && (
        <div style={{
          position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '2000', flexDirection: 'column', padding: '20px'
        }}>
          <button onClick={() => setPlayingStream(null)} style={{
            position: 'absolute', top: '20px', right: '20px', padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', zIndex: '2001'
          }}>
            ✕ Cerrar
          </button>
          <div style={{ width: '100%', maxWidth: '900px', background: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
            <video ref={videoRef} controls style={{ width: '100%', height: 'auto', maxHeight: '600px', borderRadius: '12px' }}></video>
          </div>
          <div style={{ textAlign: 'center', color: '#fff', maxWidth: '900px', width: '100%' }}>
            <h2>{playingStream.match.homeTeam} vs {playingStream.match.awayTeam}</h2>
            <p style={{ color: '#888' }}>Streaming en vivo: {playingStream.platform}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>URL: {playingStream.streamUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
