// cvProcessors.js

/**
 * Checks if OpenCV is loaded
 */
export const isCvLoaded = () => {
  return typeof cv !== 'undefined' && cv.Mat;
};

/**
 * Standard Esports HUD Minimap Coordinates (Normalized 0.0 - 1.0)
 * These are approximations for a standard 1080p stream.
 * In a real app, we might need dynamic calibration or user adjustment.
 *
 * Assuming Top Left minimap:
 * x: ~20px, y: ~20px, w: ~300px, h: ~300px on a 1920x1080 canvas
 */
const MINIMAP_ROI = {
  x: 25 / 1920,
  y: 25 / 1080,
  w: 300 / 1920,
  h: 300 / 1080
};

/**
 * Extracts the minimap region from the full source image
 * @param {HTMLCanvasElement} sourceCanvas - The full frame canvas
 * @returns {cv.Mat} The cropped minimap Mat (must be deleted by caller)
 */
export const extractMinimapROI = (sourceCanvas) => {
  if (!isCvLoaded()) return null;

  const src = cv.imread(sourceCanvas);
  const width = src.cols;
  const height = src.rows;

  const x = Math.floor(MINIMAP_ROI.x * width);
  const y = Math.floor(MINIMAP_ROI.y * height);
  const w = Math.floor(MINIMAP_ROI.w * width);
  const h = Math.floor(MINIMAP_ROI.h * height);

  const rect = new cv.Rect(x, y, w, h);
  const roi = src.roi(rect);

  // Cleanup source mat immediately as we only need the ROI
  src.delete();

  return roi;
};

/**
 * Detects player positions on the minimap
 * @param {cv.Mat} minimapMat - The cropped minimap Mat
 * @returns {Array<{x: number, y: number, team: string}>} Array of detected positions
 */
export const detectPlayers = (minimapMat) => {
  if (!minimapMat) return [];

  const players = [];
  const dst = new cv.Mat();

  // Convert to HSV for better color segmentation
  cv.cvtColor(minimapMat, dst, cv.COLOR_RGBA2RGB);
  cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV);

  // Define ranges for Attackers (Redish) and Defenders (Cyan/Greenish)
  // Note: OpenCV HSV ranges are H: 0-179, S: 0-255, V: 0-255

  // Red Mask (handling wrap-around for red)
  const lowRed1 = new cv.Mat(dst.rows, dst.cols, dst.type(), [0, 100, 100, 0]);
  const highRed1 = new cv.Mat(dst.rows, dst.cols, dst.type(), [10, 255, 255, 0]);
  const lowRed2 = new cv.Mat(dst.rows, dst.cols, dst.type(), [160, 100, 100, 0]);
  const highRed2 = new cv.Mat(dst.rows, dst.cols, dst.type(), [180, 255, 255, 0]);

  const maskRed1 = new cv.Mat();
  const maskRed2 = new cv.Mat();
  const maskRed = new cv.Mat();

  cv.inRange(dst, lowRed1, highRed1, maskRed1);
  cv.inRange(dst, lowRed2, highRed2, maskRed2);
  cv.bitwise_or(maskRed1, maskRed2, maskRed);

  // Find Contours for Red
  findAndAddPlayers(maskRed, players, 'attacker', minimapMat.cols, minimapMat.rows);

  // Cyan Mask (Defenders) ~ H: 80-100? Need to tune this.
  // Standard Cyan is around 90 in OpenCV scale (180 deg)
  const lowCyan = new cv.Mat(dst.rows, dst.cols, dst.type(), [75, 100, 100, 0]);
  const highCyan = new cv.Mat(dst.rows, dst.cols, dst.type(), [105, 255, 255, 0]);
  const maskCyan = new cv.Mat();

  cv.inRange(dst, lowCyan, highCyan, maskCyan);

  // Find Contours for Cyan
  findAndAddPlayers(maskCyan, players, 'defender', minimapMat.cols, minimapMat.rows);

  // Cleanup
  dst.delete();
  lowRed1.delete(); highRed1.delete(); lowRed2.delete(); highRed2.delete();
  maskRed1.delete(); maskRed2.delete(); maskRed.delete();
  lowCyan.delete(); highCyan.delete(); maskCyan.delete();

  return players;
};

const findAndAddPlayers = (mask, list, team, width, height) => {
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    const area = cv.contourArea(contour);

    // Filter small noise or large blocks (UI elements)
    if (area > 10 && area < 500) {
      const moments = cv.moments(contour);
      const cx = moments.m10 / moments.m00;
      const cy = moments.m01 / moments.m00;

      // Normalize to 0-1 relative to minimap size
      list.push({
        x: cx / width,
        y: cy / height,
        team
      });
    }
    // IMPORTANT: Delete the specific contour Mat to prevent memory leaks
    contour.delete();
  }

  contours.delete();
  hierarchy.delete();
};
