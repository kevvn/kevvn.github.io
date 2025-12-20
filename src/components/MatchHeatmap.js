import React, { useEffect, useRef } from 'react';
import simpleheat from 'simpleheat';

const MatchHeatmap = ({ positions }) => {
  const canvasRef = useRef(null);
  const heatRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && !heatRef.current) {
      // Initialize simpleheat on the canvas
      heatRef.current = simpleheat(canvasRef.current);

      // Configure: radius, blur
      heatRef.current.radius(20, 15);

      // Set max data value (1 means a single detection is "hot")
      heatRef.current.max(1);

      // Configure gradient colors (optional override)
      // heatRef.current.gradient({0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'});
    }
  }, []);

  useEffect(() => {
    if (heatRef.current && positions && positions.length > 0) {
      const canvas = canvasRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Add new data points
      // Each position is { x: 0..1, y: 0..1, team: '...' }
      // Simpleheat takes [x, y, intensity]

      positions.forEach(pos => {
        // Map normalized coordinates to canvas dimensions
        const x = pos.x * width;
        const y = pos.y * height;
        heatRef.current.add([x, y, 1]);
      });

      // Redraw
      // We often want to clear the canvas or fade it, but heatmaps usually accumulate.
      // If we want to show 'current' state only, we would clear data.
      // For a match heatmap, we probably want accumulation.

      // However, simpleheat keeps data in memory. If we just keep adding, it gets heavy.
      // For this MVP, we will assume we are adding to a persistent heatmap.

      heatRef.current.draw();
    }
  }, [positions]);

  return (
    <div className="heatmap-container" style={{ position: 'relative', width: '500px', height: '500px', border: '1px solid #666', background: '#1a1a1a' }}>
        <h3 style={{ position: 'absolute', top: 0, left: 10, color: '#fff', zIndex: 10 }}>Live Heatmap</h3>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={{ width: '100%', height: '100%' }}
        />
    </div>
  );
};

export default MatchHeatmap;
