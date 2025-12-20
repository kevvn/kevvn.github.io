// ROI Constants (Approximations for 1080p standard layout)
// These would ideally be calibrated or detected dynamically.
// Minimap is usually top-left.
const MINIMAP_ROI = { x: 20, y: 20, width: 300, height: 300 };
// Money/Buy text is usually mid-bottom or right side depending on UI state.
const MONEY_ROI = { x: 1500, y: 900, width: 200, height: 100 };

/**
 * Extracts the minimap region from the full frame canvas.
 * @param {HTMLCanvasElement} sourceCanvas
 * @returns {ImageData} The pixel data of the minimap.
 */
export const extractMinimapROI = (sourceCanvas) => {
  const ctx = sourceCanvas.getContext('2d');
  return ctx.getImageData(MINIMAP_ROI.x, MINIMAP_ROI.y, MINIMAP_ROI.width, MINIMAP_ROI.height);
};

/**
 * Detects players on the minimap using OpenCV.js
 * @param {HTMLCanvasElement} sourceCanvas
 * @returns {Array<{x: number, y: number, team: 'enemy'|'ally'}>} List of detected player positions relative to the minimap
 */
export const detectPlayers = (sourceCanvas) => {
    // Ensure OpenCV is loaded
    if (typeof cv === 'undefined') {
        console.log("OpenCV not loaded yet.");
        return [];
    }

    const positions = [];

    // Create Mat from the minimap region directly
    let src = cv.imread(sourceCanvas);

    console.log("Image size:", src.cols, src.rows);

    // Define ROI
    let rect = new cv.Rect(MINIMAP_ROI.x, MINIMAP_ROI.y, MINIMAP_ROI.width, MINIMAP_ROI.height);
    console.log("ROI:", rect.x, rect.y, rect.width, rect.height);

    // Check bounds
    if (rect.x + rect.width > src.cols || rect.y + rect.height > src.rows) {
        console.log("ROI out of bounds!");
        src.delete();
        return [];
    }

    let dst = src.roi(rect);
    let hsv = new cv.Mat();
    cv.cvtColor(dst, hsv, cv.COLOR_RGBA2RGB);
    cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

    // Define Red Color Range (Enemy) - Red wraps around in HSV
    // Lower red
    let lowerRed1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 100, 100, 0]);
    let upperRed1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [10, 255, 255, 0]);
    // Upper red
    let lowerRed2 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [170, 100, 100, 0]);
    let upperRed2 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [180, 255, 255, 0]);

    let mask1 = new cv.Mat();
    let mask2 = new cv.Mat();
    let maskFinal = new cv.Mat();

    cv.inRange(hsv, lowerRed1, upperRed1, mask1);
    cv.inRange(hsv, lowerRed2, upperRed2, mask2);
    cv.addWeighted(mask1, 1.0, mask2, 1.0, 0.0, maskFinal);

    // Find Contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(maskFinal, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    console.log("Contours found:", contours.size());

    for (let i = 0; i < contours.size(); ++i) {
        let contour = contours.get(i);
        let area = cv.contourArea(contour);
        console.log("Contour", i, "Area:", area);

        // Filter noise
        if (area > 10 && area < 500) {
            let moments = cv.moments(contour, false);
            let cx = moments.m10 / moments.m00;
            let cy = moments.m01 / moments.m00;

            // Normalize coordinates (0.0 to 1.0)
            // rect.width and rect.height are the dimensions of the ROI (300x300)
            let normalizedX = cx / rect.width;
            let normalizedY = cy / rect.height;

            positions.push({ x: normalizedX, y: normalizedY, team: 'enemy' });
        }
    }

    // Cleanup OpenCV objects
    src.delete(); dst.delete(); hsv.delete();
    lowerRed1.delete(); upperRed1.delete();
    lowerRed2.delete(); upperRed2.delete();
    mask1.delete(); mask2.delete(); maskFinal.delete();
    contours.delete(); hierarchy.delete();

    return positions;
};

/**
 * Extract image data for OCR
 */
export const extractMoneyText = (sourceCanvas) => {
    const ctx = sourceCanvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = MONEY_ROI.width;
    tempCanvas.height = MONEY_ROI.height;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.drawImage(sourceCanvas,
        MONEY_ROI.x, MONEY_ROI.y, MONEY_ROI.width, MONEY_ROI.height,
        0, 0, MONEY_ROI.width, MONEY_ROI.height
    );
    return tempCanvas.toDataURL('image/png');
}
