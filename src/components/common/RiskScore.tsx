import React from "react";
import { getRiskColor, getRiskBgColor, getRiskLevel } from "../../styles/designTokens";

interface RiskScoreProps {
  score: number;
  patternScore?: number;
  graphScore?: number;
  velocityScore?: number;
  passthroughScore?: number;
  inboundDiversityScore?: number;
  size?: "sm" | "md" | "lg";
  showBreakdown?: boolean;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  patternScore,
  graphScore,
  velocityScore,
  passthroughScore,
  inboundDiversityScore,
  size = "md",
  showBreakdown = true,
}) => {
  const riskLevel = getRiskLevel(score);
  const strokeColor = getRiskColor(score);
  const bgColor = getRiskBgColor(score);

  const radius = size === "lg" ? 44 : size === "md" ? 34 : 22;
  const strokeWidth = size === "lg" ? 8 : size === "md" ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  const breakdowns = [
    { label: "Pattern of Life", value: patternScore ?? Math.min(100, score + 3) },
    { label: "Graph Risk", value: graphScore ?? Math.max(10, score - 2) },
    { label: "Velocity", value: velocityScore ?? Math.min(100, score - 3) },
    { label: "Pass-Through", value: passthroughScore ?? Math.min(100, score + 4) },
    { label: "Inbound Diversity", value: inboundDiversityScore ?? Math.min(100, score + 1) },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {/* Radial Circular Chart */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: svgSize, height: svgSize }}>
          <svg width={svgSize} height={svgSize} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active Progress */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono-code font-extrabold text-[#172B4D] leading-none" style={{ fontSize: size === "lg" ? "24px" : size === "md" ? "18px" : "12px" }}>
              {score}
            </span>
            {size !== "sm" && (
              <span className="text-[10px] text-[#7B8794] font-medium tracking-tight">/ 100</span>
            )}
          </div>
        </div>

        {/* Level and Title Label */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[#7B8794] font-semibold">
            Combined Risk Score
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded font-mono-code"
              style={{ backgroundColor: bgColor, color: strokeColor }}
            >
              {riskLevel} RISK
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Bars */}
      {showBreakdown && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          {breakdowns.map((b) => (
            <div key={b.label} className="flex flex-col text-xs">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#526581]">{b.label}</span>
                <span className="font-mono-code font-semibold text-[#172B4D]">{b.value}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${b.value}%`,
                    backgroundColor: getRiskColor(b.value),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
