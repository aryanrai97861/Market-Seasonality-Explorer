import React from 'react';

interface IndicatorMiniChartProps {
  data: (number | null)[];
  color?: string;
  height?: number;
  min?: number;
  max?: number;
  overbought?: number;
  oversold?: number;
  label?: string;
}

// Simple SVG sparkline/area for indicator visualization
export default function IndicatorMiniChart({
  data,
  color = '#60a5fa',
  height = 36,
  min,
  max,
  overbought,
  oversold,
  label,
}: IndicatorMiniChartProps) {
  if (!data || data.length === 0) return null;
  const filtered = data.filter((v): v is number => typeof v === 'number');
  if (filtered.length === 0) return null;
  const yMin = typeof min === 'number' ? min : Math.min(...filtered);
  const yMax = typeof max === 'number' ? max : Math.max(...filtered);
  const w = 80;
  const h = height;
  const points = filtered.map((v, i) => {
    const x = (i / (filtered.length - 1)) * w;
    const y = h - ((v - yMin) / (yMax - yMin)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="block">
      {/* Overbought/Oversold lines for RSI */}
      {typeof overbought === 'number' && (
        <line x1={0} x2={w} y1={h - ((overbought - yMin) / (yMax - yMin)) * h} y2={h - ((overbought - yMin) / (yMax - yMin)) * h} stroke="#fbbf24" strokeDasharray="2,2" />
      )}
      {typeof oversold === 'number' && (
        <line x1={0} x2={w} y1={h - ((oversold - yMin) / (yMax - yMin)) * h} y2={h - ((oversold - yMin) / (yMax - yMin)) * h} stroke="#f87171" strokeDasharray="2,2" />
      )}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        points={points}
      />
      {label && <text x={4} y={14} fontSize={11} fill="#94a3b8">{label}</text>}
    </svg>
  );
}
