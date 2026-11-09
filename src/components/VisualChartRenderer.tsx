import React from 'react';
import { Compass, Info, ArrowRight } from 'lucide-react';

export interface LineChartData {
  years: number[] | string[];
  series: { name: string; color: string; values: number[] }[];
  yUnit?: string;
  maxY?: number;
}

export interface BarChartData {
  categories: string[];
  demographics: { name: string; color: string; values: number[] }[];
  yUnit?: string;
  maxY?: number;
}

export interface PieChartData {
  title1: string;
  title2?: string;
  segments1: { name: string; percentage: number; color: string }[];
  segments2?: { name: string; percentage: number; color: string }[];
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export interface MapData {
  title: string;
  landmarks: { id: string; label: string; x: number; y: number; name: string }[];
}

interface VisualChartRendererProps {
  type: 'line' | 'bar' | 'pie' | 'process' | 'map' | 'table' | 'combined';
  data: any;
  caption?: string;
  className?: string;
}

export const VisualChartRenderer: React.FC<VisualChartRendererProps> = ({
  type,
  data,
  caption,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-sm overflow-hidden space-y-3 ${className}`}
    >
      {caption && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-red-500" />
            {caption}
          </span>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            IELTS Figure
          </span>
        </div>
      )}

      {/* ================= 1. LINE GRAPH ================= */}
      {type === 'line' && (
        <div className="space-y-3">
          <div className="relative w-full h-56 bg-slate-50/60 dark:bg-slate-950/40 rounded-xl p-2 border border-slate-100 dark:border-slate-800 select-none">
            <svg className="w-full h-full" viewBox="0 0 420 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = 170 - (val / 100) * 140;
                return (
                  <g key={val}>
                    <line
                      x1="45"
                      y1={y}
                      x2="400"
                      y2={y}
                      stroke="#cbd5e1"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                    <text
                      x="38"
                      y={y + 4}
                      fontSize="10"
                      fill="#94a3b8"
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* X Axis Baseline */}
              <line x1="45" y1="170" x2="400" y2="170" stroke="#94a3b8" strokeWidth="1.5" />

              {/* X Axis Labels */}
              {data.years.map((year: any, i: number) => {
                const step = 350 / (data.years.length - 1);
                const x = 50 + i * step;
                return (
                  <text
                    key={year}
                    x={x}
                    y="190"
                    fontSize="11"
                    fill="#64748b"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {year}
                  </text>
                );
              })}

              {/* Lines & Data Dots */}
              {data.series.map((s: any) => {
                const step = 350 / (data.years.length - 1);
                const points = s.values
                  .map((v: number, i: number) => {
                    const x = 50 + i * step;
                    const y = 170 - (v / (data.maxY || 100)) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <g key={s.name}>
                    <polyline
                      fill="none"
                      stroke={s.color}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    {s.values.map((v: number, i: number) => {
                      const x = 50 + i * step;
                      const y = 170 - (v / (data.maxY || 100)) * 140;
                      return (
                        <g key={i}>
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill={s.color}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold pt-1">
            {data.series.map((s: any) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-xs"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-slate-700 dark:text-slate-300">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 2. BAR CHART ================= */}
      {type === 'bar' && (
        <div className="space-y-3">
          <div className="relative w-full h-60 bg-slate-50/60 dark:bg-slate-950/40 rounded-xl p-2 border border-slate-100 dark:border-slate-800 select-none">
            <svg className="w-full h-full" viewBox="0 0 460 210" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 20, 40, 60, 80, 100].map((val) => {
                const y = 170 - (val / 100) * 145;
                return (
                  <g key={val}>
                    <line
                      x1="45"
                      y1={y}
                      x2="445"
                      y2={y}
                      stroke="#cbd5e1"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                    <text
                      x="38"
                      y={y + 4}
                      fontSize="10"
                      fill="#94a3b8"
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              <line x1="45" y1="170" x2="445" y2="170" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Grouped Bars */}
              {data.categories.map((cat: string, cIdx: number) => {
                const groupWidth = 380 / data.categories.length;
                const groupX = 55 + cIdx * groupWidth;
                const barWidth = Math.min(18, (groupWidth - 12) / data.demographics.length);

                return (
                  <g key={cat}>
                    {/* Category X Label */}
                    <text
                      x={groupX + (data.demographics.length * barWidth) / 2}
                      y="190"
                      fontSize="10"
                      fill="#64748b"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {cat}
                    </text>

                    {/* Bars */}
                    {data.demographics.map((demo: any, dIdx: number) => {
                      const val = demo.values[cIdx] || 0;
                      const barHeight = (val / 100) * 145;
                      const bx = groupX + dIdx * barWidth;
                      const by = 170 - barHeight;

                      return (
                        <g key={demo.name}>
                          <rect
                            x={bx}
                            y={by}
                            width={barWidth - 2}
                            height={barHeight}
                            fill={demo.color}
                            rx="3"
                          />
                          <text
                            x={bx + (barWidth - 2) / 2}
                            y={by - 3}
                            fontSize="8"
                            fill="#64748b"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold pt-1">
            {data.demographics.map((d: any) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: d.color }} />
                <span className="text-slate-700 dark:text-slate-300">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 3. PIE CHARTS (COMPARATIVE) ================= */}
      {type === 'pie' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {[
            { title: data.title1, segments: data.segments1 },
            { title: data.title2, segments: data.segments2 },
          ].map((pie, pIdx) => {
            if (!pie.segments) return null;

            // Generate SVG Pie wedges
            let cumulativeAngle = 0;
            const size = 160;
            const center = size / 2;
            const radius = 65;

            return (
              <div
                key={pIdx}
                className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-center space-y-2"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {pie.title}
                </span>

                <div className="flex justify-center">
                  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {pie.segments.map((seg: any) => {
                      const startAngle = cumulativeAngle;
                      const sliceAngle = (seg.percentage / 100) * 360;
                      cumulativeAngle += sliceAngle;
                      const endAngle = cumulativeAngle;

                      const startRad = ((startAngle - 90) * Math.PI) / 180;
                      const endRad = ((endAngle - 90) * Math.PI) / 180;

                      const x1 = center + radius * Math.cos(startRad);
                      const y1 = center + radius * Math.sin(startRad);
                      const x2 = center + radius * Math.cos(endRad);
                      const y2 = center + radius * Math.sin(endRad);

                      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                      return (
                        <path
                          key={seg.name}
                          d={pathData}
                          fill={seg.color}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] font-medium text-left pt-1">
                  {pie.segments.map((seg: any) => (
                    <div key={seg.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                      <span className="truncate text-slate-600 dark:text-slate-300">
                        {seg.name} ({seg.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= 4. INDUSTRIAL / NATURAL PROCESS DIAGRAM ================= */}
      {type === 'process' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.steps.map((st: ProcessStep, i: number) => (
              <div
                key={st.stepNumber}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 relative space-y-1.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">
                    {st.stepNumber}
                  </span>
                  {i < data.steps.length - 1 && (
                    <span className="text-slate-400 font-bold hidden sm:inline-block">→</span>
                  )}
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    {st.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. REALISTIC IELTS MAP / PLAN (FOR LISTENING & WRITING) ================= */}
      {type === 'map' && (
        <div className="space-y-2">
          <div className="relative w-full h-72 bg-emerald-50/40 dark:bg-slate-950/80 rounded-2xl p-3 border border-emerald-200/60 dark:border-slate-800 select-none overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 500 280">
              {/* Outer boundary lawn */}
              <rect x="10" y="10" width="480" height="260" rx="15" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />

              {/* Compass Rose */}
              <g transform="translate(450, 45)">
                <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M 0 -14 L 4 -2 L 0 0 L -4 -2 Z" fill="#dc2626" />
                <path d="M 0 14 L 4 2 L 0 0 L -4 2 Z" fill="#64748b" />
                <text x="0" y="-18" fontSize="10" fill="#dc2626" fontWeight="bold" textAnchor="middle">
                  N
                </text>
                <text x="18" y="4" fontSize="9" fill="#64748b" fontWeight="bold" textAnchor="start">
                  E
                </text>
                <text x="-18" y="4" fontSize="9" fill="#64748b" fontWeight="bold" textAnchor="end">
                  W
                </text>
                <text x="0" y="24" fontSize="9" fill="#64748b" fontWeight="bold" textAnchor="middle">
                  S
                </text>
              </g>

              {/* River on the East */}
              <path
                d="M 430 10 Q 400 80 435 150 T 420 270"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="16"
                opacity="0.8"
              />
              <text x="445" y="140" fontSize="9" fill="#2563eb" fontWeight="bold" transform="rotate(75, 445, 140)">
                Willow River
              </text>

              {/* Lake in Central East */}
              <ellipse cx="330" cy="120" rx="45" ry="30" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
              <text x="330" y="123" fontSize="10" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">
                Mirror Lake
              </text>

              {/* Pathways */}
              {/* Central Avenue from North Gate */}
              <rect x="235" y="10" width="30" height="80" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
              {/* Left gravel path to Location A */}
              <path d="M 235 35 Q 150 40 100 70" fill="none" stroke="#d97706" strokeWidth="10" strokeDasharray="3 3" />
              {/* Eastern path past Lake to Location C */}
              <path d="M 265 65 Q 310 70 335 85" fill="none" stroke="#d97706" strokeWidth="10" strokeDasharray="3 3" />
              {/* South path to Playground */}
              <path d="M 250 150 L 120 220" fill="none" stroke="#cbd5e1" strokeWidth="12" />

              {/* North Gate Entrance */}
              <g transform="translate(225, 12)">
                <rect x="0" y="0" width="50" height="18" rx="4" fill="#1e293b" />
                <text x="25" y="12" fontSize="9" fill="#ffffff" fontWeight="bold" textAnchor="middle">
                  North Gate
                </text>
              </g>

              {/* Central Courtyard & Fountain */}
              <g transform="translate(250, 110)">
                <circle cx="0" cy="0" r="28" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="0" cy="0" r="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                <text x="0" y="3" fontSize="8" fill="#0369a1" fontWeight="bold" textAnchor="middle">
                  Fountain
                </text>
              </g>

              {/* LOCATION A: Victorian Glasshouse (Left of North Gate along gravel path) */}
              <g transform="translate(50, 65)">
                <rect x="0" y="0" width="70" height="45" rx="8" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                <circle cx="16" cy="16" r="10" fill="#dc2626" />
                <text x="16" y="20" fontSize="11" fill="#ffffff" fontWeight="black" textAnchor="middle">
                  A
                </text>
                <text x="35" y="36" fontSize="8" fill="#065f46" fontWeight="bold" textAnchor="middle">
                  Location A
                </text>
              </g>

              {/* LOCATION B: Heritage Rose Garden (Opposite North Gate across Fountain) */}
              <g transform="translate(215, 175)">
                <rect x="0" y="0" width="70" height="45" rx="8" fill="#fdf2f8" stroke="#db2777" strokeWidth="2" />
                <circle cx="16" cy="16" r="10" fill="#dc2626" />
                <text x="16" y="20" fontSize="11" fill="#ffffff" fontWeight="black" textAnchor="middle">
                  B
                </text>
                <text x="35" y="36" fontSize="8" fill="#9d174d" fontWeight="bold" textAnchor="middle">
                  Location B
                </text>
              </g>

              {/* LOCATION C: Solar Pavilion & Tea Room (East past the Lake) */}
              <g transform="translate(320, 170)">
                <rect x="0" y="0" width="75" height="45" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                <circle cx="16" cy="16" r="10" fill="#dc2626" />
                <text x="16" y="20" fontSize="11" fill="#ffffff" fontWeight="black" textAnchor="middle">
                  C
                </text>
                <text x="38" y="36" fontSize="8" fill="#92400e" fontWeight="bold" textAnchor="middle">
                  Location C
                </text>
              </g>

              {/* LOCATION D: Children's Adventure Playground (Far Southwestern corner) */}
              <g transform="translate(50, 195)">
                <rect x="0" y="0" width="85" height="45" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
                <circle cx="16" cy="16" r="10" fill="#dc2626" />
                <text x="16" y="20" fontSize="11" fill="#ffffff" fontWeight="black" textAnchor="middle">
                  D
                </text>
                <text x="45" y="36" fontSize="8" fill="#991b1b" fontWeight="bold" textAnchor="middle">
                  Location D
                </text>
              </g>

              {/* Old Cafe (Under Renovation) by River */}
              <g transform="translate(390, 60)">
                <rect x="0" y="0" width="45" height="30" rx="4" fill="#fee2e2" stroke="#f87171" strokeWidth="1" strokeDasharray="2 2" />
                <text x="22" y="14" fontSize="7" fill="#b91c1c" fontWeight="bold" textAnchor="middle">
                  Old Café
                </text>
                <text x="22" y="24" fontSize="6" fill="#7f1d1d" textAnchor="middle">
                  (Closed)
                </text>
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 pt-1">
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">A</span>
              Location A
            </span>
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">B</span>
              Location B
            </span>
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">C</span>
              Location C
            </span>
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">D</span>
              Location D
            </span>
          </div>
        </div>
      )}

      {/* ================= 6. DATA TABLE (ACADEMIC TASK 1) ================= */}
      {type === 'table' && data?.headers && data?.rows && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
              <tr>
                {data.headers.map((h: string, i: number) => (
                  <th key={i} className="py-2.5 px-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {data.rows.map((row: (string | number)[], rIdx: number) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-2.5 px-3 ${cIdx === 0 ? 'font-bold text-slate-900 dark:text-white' : 'font-mono'}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= 7. COMBINED / MULTIPLE CHARTS (BAR + TABLE) ================= */}
      {type === 'combined' && (
        <div className="space-y-4">
          {data?.barSection && (
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {data.barSection.title}
              </span>
              <div className="space-y-2">
                {data.barSection.items.map((it: { label: string; value: number; unit: string; color: string }) => (
                  <div key={it.label} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span>{it.label}</span>
                      <span className="font-mono">
                        {it.value}
                        {it.unit}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, it.value)}%`, backgroundColor: it.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.tableSection && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                {data.tableSection.title}
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {data.tableSection.headers.map((h: string, i: number) => (
                      <th key={i} className="py-2 px-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                  {data.tableSection.rows.map((row: (string | number)[], rIdx: number) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2 px-3 ${cIdx === 0 ? 'font-bold' : 'font-mono'}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
