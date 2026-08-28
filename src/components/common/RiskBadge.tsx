import React from "react";
import type { RiskLevel } from "../../types/transaction";
import { RISK_LEVEL_CONFIG } from "../../styles/designTokens";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showScore = true,
  size = "md",
  className = "",
}) => {
  const config = RISK_LEVEL_CONFIG[level] || RISK_LEVEL_CONFIG.LOW;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono-code font-bold rounded-full border shadow-2xs ${config.badgeClass} ${sizeClasses[size]} ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.color }}
      />
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-90 font-mono-code">({score})</span>
      )}
    </span>
  );
};
export default RiskBadge;
