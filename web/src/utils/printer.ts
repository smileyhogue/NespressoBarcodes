
export const BARCODE_CONFIG = {
  POD_OUTER_DIA: 2.26, // inches
  POD_INNER_DIA: 2.02, // inches
  CODON_WIDTH_TOLERANCE: 0.5, // degrees
};

interface Codon {
  color: "black" | "white";
  startAngle: number;
  endAngle: number;
}

export function drawBarcode(canvas: HTMLCanvasElement, code: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const length = code.length;
  const angleSize = 360 / length;
  
  // Calculate dimensions based on canvas size
  // We want to maximize usage of canvas but keep padding
  const size = Math.min(canvas.width, canvas.height);
  const center = size / 2;
  const radius = (size / 2) * 0.95; // 5% padding
  
  // Calculate relative thickness based on physical dimensions
  // Ratio of thickness to outer diameter
  const physicalThickness = (BARCODE_CONFIG.POD_OUTER_DIA - BARCODE_CONFIG.POD_INNER_DIA) / 2; // radius diff
  // Actually, the thickness in the python script is:
  // CODON_HEIGHT = int(DPI * (POD_OUTER_DIA - POD_INNER_DIA) * 0.6)
  // This seems to imply the band is not the full gap? 
  // Let's stick to the visual proportion.
  // 2.26 outer, 2.02 inner.
  // Thickness = (2.26 - 2.02) / 2 = 0.12 inches.
  // Ratio = 0.12 / (2.26 / 2) = 0.12 / 1.13 ~= 0.106
  
  // Python script logic:
  // DPI = IMAGE_SIZE / POD_OUTER_DIA = 2400 / 2.26 = 1061.9
  // Height = 1061.9 * (2.26 - 2.02) * 0.6 = 1061.9 * 0.24 * 0.6 = 152.9 pixels
  // Radius in pixels = 1200.
  // So thickness ratio relative to radius = 153 / 1200 = 0.1275
  
  const thickness = radius * 0.15; // approximate visual match, slightly thicker for safety
  
  const codons: Codon[] = [];
  let currentAngle = 0;
  let i = 0;

  while (i < length) {
    const value = code[i];
    
    // Find consecutive same values
    const changeValue = value === "1" ? "0" : "1";
    let changeIndex = code.indexOf(changeValue, i);
    if (changeIndex === -1) {
      changeIndex = length;
    }
    
    const codonWidth = changeIndex - i;
    
    const startAngle = currentAngle + BARCODE_CONFIG.CODON_WIDTH_TOLERANCE;
    const endAngle = startAngle + (codonWidth * angleSize) - BARCODE_CONFIG.CODON_WIDTH_TOLERANCE;
    
    codons.push({
      color: value === "1" ? "black" : "white",
      startAngle: startAngle,
      endAngle: endAngle
    });
    
    currentAngle += codonWidth * angleSize;
    i += codonWidth;
  }
  
  // Draw
  ctx.lineWidth = thickness;
  ctx.lineCap = "butt"; // Sharp edges as per python script implied arc drawing
  
  // Python PIL arc draws from start to end angle. 0 is usually 3 o'clock?
  // We need to verify orientation. Python standard behavior: 0 is 3 o'clock, clockwise.
  // Canvas arc: 0 is 3 o'clock, clockwise. match!
  // BUT Python PIL might use degrees, Canvas uses radians.
  
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  codons.forEach(codon => {
    if (codon.color === "white") return; // Skip white, let background show (or transparent)
    
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.arc(center, center, radius - (thickness/2), toRad(codon.startAngle), toRad(codon.endAngle));
    ctx.stroke();
  });
}
