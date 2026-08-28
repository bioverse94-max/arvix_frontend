import React from "react";
import type { LucideIcon } from "lucide-react";

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isIncrease: boolean;
  };
  comparison?: string;
  tooltip?: string;
  badge?: string;
  badgeType?: "danger" | "warning" | "success" | "info";
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  trend,
  comparison,
  badge,
  badgeType = "info",
  className = "",
}) => {
  return (
    <div
      className={`bg-white border border-[#E1E7ED] rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-[#0072BC]/40 transition-colors ${className}`}
    >
      {/* Top row: Label + Badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#526581]">
          {label}
        </span>

        {badge && (
          <span
            className={`text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
              badgeType === "danger"
                ? "bg-[#FCEAEB] text-[#A91D2F]"
                : badgeType === "warning"
                ? "bg-[#FEF7E6] text-[#D99000]"
                : badgeType === "success"
                ? "bg-[#E8F8F0] text-[#168A5B]"
                : "bg-[#EAF5FC] text-[#0072BC]"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="my-2">
        <span className="text-2xl font-bold font-mono-code text-[#172B4D] tracking-tight">
          {value}
        </span>
      </div>

      {/* Bottom: Trend / Comparison */}
      {(trend || comparison) && (
        <div className="flex items-center gap-2 text-xs pt-2 border-t border-[#F5F7FA]">
          {trend && (
            <span
              className={`font-mono-code font-semibold text-[11px] ${
                trend.isIncrease ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {trend.value}
            </span>
          )}
          {comparison && (
            <span className="text-[11px] text-[#7B8794] truncate">
              {comparison}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default KpiCard;
