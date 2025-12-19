import React, { useRef, useEffect, useState } from 'react';

const StreamCapture = ({ onFrame }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "never"
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsStreaming(true);
        };
      }
    } catch (err) {
      console.error("Error capturing stream:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    let animationFrameId;

    const processFrame = () => {
      if (isStreaming && videoRef.current && canvasRef.current && onFrame) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Check if video has valid dimensions
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Pass the canvas element (or image data) to the parent/callback for processing
            onFrame(canvas);
        }
      }
      animationFrameId = requestAnimationFrame(processFrame);
    };

    if (isStreaming) {
      processFrame();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isStreaming, onFrame]);

  return (
    <div className="stream-capture">
      <div className="controls">
        {!isStreaming && (
            <button onClick={startCapture} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Select Screen to Capture
            </button>
        )}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>

      {/* Hidden video element for the raw stream */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        autoPlay
        playsInline
        muted
      />

      {/* Visible canvas showing what we are capturing (optional, can be hidden later) */}
      <div style={{ marginTop: '20px' }}>
          <h3>Live Feed Preview</h3>
          <canvas
            ref={canvasRef}
            style={{ maxWidth: '100%', border: '1px solid #444' }}
          />
      </div>
    </div>
  );
};

export default StreamCapture;
