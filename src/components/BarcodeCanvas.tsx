"use client";

import { useEffect, useRef } from "react";
import { drawBarcode } from "@/utils/printer";

interface BarcodeCanvasProps {
  code: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function BarcodeCanvas({ code, className, width = 1200, height = 1200 }: BarcodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawBarcode(canvas, code);
    }
  }, [code]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        // Maintain aspect ratio but allow CSS to control display size
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
}
