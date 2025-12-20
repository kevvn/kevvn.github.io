import React, { useState, useEffect, useRef } from 'react';
import StreamCapture from './components/StreamCapture';
import MatchHeatmap from './components/MatchHeatmap';
import Dashboard from './components/Dashboard';
import { detectPlayers, extractMoneyText } from './utils/cvProcessors';
import Tesseract from 'tesseract.js';

function App() {
  const [players, setPlayers] = useState([]);
  const [economy, setEconomy] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugImage, setDebugImage] = useState(null);

  // Throttle OCR
  const lastOcrTime = useRef(0);

  const processFrame = async (canvas) => {
    if (isProcessing) return; // Prevent overlapping frames if processing is slow
    setIsProcessing(true);

    try {
      // 1. Detect Players (Fast, every frame or every few frames)
      const currentPlayers = detectPlayers(canvas);
      if (currentPlayers.length > 0) {
        console.log("Players Detected:", JSON.stringify(currentPlayers));
        setPlayers(currentPlayers);
      } else {
        console.log("No players detected.");
      }

      // 2. OCR (Slow, run once every second)
      const now = Date.now();
      if (now - lastOcrTime.current > 1000) {
        lastOcrTime.current = now;
        const moneyImage = extractMoneyText(canvas);

        const { data: { text } } = await Tesseract.recognize(moneyImage, 'eng', {
           // logger: m => console.log(m)
        });

        const moneyVal = text.replace(/[^0-9]/g, '');
        if (moneyVal) setEconomy(moneyVal);
      }

    } catch (e) {
      console.error("Processing Error", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestMode = () => {
     const img = new Image();
     img.src = '/test_frame.jpg';
     img.onload = () => {
         const canvas = document.createElement('canvas');
         canvas.width = img.width;
         canvas.height = img.height;
         const ctx = canvas.getContext('2d');
         ctx.drawImage(img, 0, 0);
         setDebugImage(canvas.toDataURL());
         processFrame(canvas);
     };
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ padding: '20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Valorant Stream Analyzer</h1>
        <button onClick={handleTestMode} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
            Run Test Mode
        </button>
      </header>

      <div className="main-content" style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px' }}>
        <div className="left-panel" style={{ flex: 2 }}>
            <h2>Live Feed</h2>
            <StreamCapture onFrame={processFrame} />
            {debugImage && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Test Image Loaded:</h3>
                    <img src={debugImage} alt="Debug" style={{ maxWidth: '100%', border: '2px solid red' }} />
                </div>
            )}
        </div>

        <div className="right-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <MatchHeatmap players={players} />
            <Dashboard economy={economy} />
        </div>
      </div>
    </div>
  );
}

export default App;
