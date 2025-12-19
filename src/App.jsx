import React, { useState, useCallback, useRef } from 'react';
import StreamCapture from './components/StreamCapture';
import MatchHeatmap from './components/MatchHeatmap';
import { extractMinimapROI, detectPlayers, isCvLoaded } from './utils/cvProcessors';

function App() {
  const [positions, setPositions] = useState([]);
  const [cvReady, setCvReady] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Polling to check if OpenCV is loaded
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (isCvLoaded()) {
        setCvReady(true);
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleFrame = useCallback((canvas) => {
    if (!cvReady) return;

    try {
      // 1. Extract Minimap ROI
      const minimapMat = extractMinimapROI(canvas);

      if (minimapMat) {
        // 2. Detect Players
        const foundPlayers = detectPlayers(minimapMat);

        // 3. Update Heatmap State
        // Only update if we found players to avoid unnecessary re-renders or empty data
        if (foundPlayers.length > 0) {
            setPositions(foundPlayers);
        }

        // Cleanup Mat
        minimapMat.delete();
      }
    } catch (e) {
      console.error("CV Processing Error:", e);
    }
  }, [cvReady]);

  // Test Mode Handler
  const handleTestImage = () => {
    if (!cvReady) return;
    const img = new Image();
    img.src = '/test_frame.jpg'; // We will create this file in the next step
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        handleFrame(canvas);
        setDebugMode(true);
    };
  };

  return (
    <div className="app-container" style={{ padding: '20px' }}>
      <h1>Valorant Live Tracker</h1>

      <div className="status-bar" style={{ marginBottom: '20px' }}>
        <span style={{ color: cvReady ? 'lightgreen' : 'orange' }}>
            OpenCV: {cvReady ? 'Ready' : 'Loading...'}
        </span>
        <button
            onClick={handleTestImage}
            disabled={!cvReady}
            style={{ marginLeft: '20px' }}
        >
            Load Test Image
        </button>
      </div>

      <div className="main-layout" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="capture-section">
            <StreamCapture onFrame={handleFrame} />
        </div>

        <div className="visualization-section">
            <MatchHeatmap positions={positions} />
            {positions.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                    <p>Detected Entities: {positions.length}</p>
                    {debugMode && (
                        <small>Last Coordinates: {JSON.stringify(positions.slice(0, 3))}...</small>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;
