import { useEffect, useRef } from "react";

// Lightweight QR code renderer using the qrcode library pattern
// We'll use a canvas-based approach with a simple QR generation

const QR_MODULES = 21; // QR version 1

function generateQRMatrix(data) {
  // Simple placeholder matrix — in production use a proper QR lib
  // Returns a 21×21 boolean matrix
  const size = 25;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  
  // Finder patterns (corners)
  const drawFinder = (row, col) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if ((onBorder || inCenter) && row + r < size && col + c < size) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Data pattern based on hash string
  const chars = data.split("");
  let charIdx = 0;
  for (let r = 8; r < size - 8; r++) {
    for (let c = 8; c < size - 8; c++) {
      const charCode = chars[charIdx % chars.length]?.charCodeAt(0) || 65;
      matrix[r][c] = ((charCode + r * 3 + c * 7) % 2) === 0;
      charIdx++;
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  return matrix;
}

export default function QRCodeCanvas({ value = "", size = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const matrix = generateQRMatrix(value);
    const moduleCount = matrix.length;
    const moduleSize = size / (moduleCount + 2); // +2 for quiet zone
    const qr_size = moduleSize * (moduleCount + 2);
    canvas.width = qr_size;
    canvas.height = qr_size;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, qr_size, qr_size);

    // Draw modules
    ctx.fillStyle = "#1a1a2e";
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(
            (c + 1) * moduleSize,
            (r + 1) * moduleSize,
            moduleSize - 0.5,
            moduleSize - 0.5
          );
        }
      }
    }

    // Green logo watermark in center
    const centerX = qr_size / 2;
    const centerY = qr_size / 2;
    const logoSize = moduleSize * 4;

    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.roundRect(centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize, 4);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${logoSize * 0.55}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("K", centerX, centerY);
  }, [value, size]);

  return (
    <div className="inline-block rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <canvas ref={canvasRef} style={{ width: size, height: size, display: "block" }} />
    </div>
  );
}