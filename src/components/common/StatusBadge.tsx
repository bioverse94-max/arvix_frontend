import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const norm = (status || "").toUpperCase();

  let colorClass = "bg-slate-100 text-slate-700 border-slate-300";

  switch (norm) {
    case "SUCCESS":
    case "ACTIVE":
    case "CLEARED":
    case "OPERATIONAL":
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "HELD":
    case "HELD_STEP_UP":
    case "STEP_UP_REQUIRED":
    case "STEP_UP_SENT":
    case "STEP_UP_ISSUED":
      colorClass = "bg-amber-50 text-amber-800 border-amber-300";
      break;
    case "FROZEN":
    case "BLOCKED":
    case "FAILED":
    case "CRITICAL":
    case "ESCALATED":
    case "ESCALATED_LE":
      colorClass = "bg-red-50 text-red-700 border-red-200";
      break;
    case "NEW":
      colorClass = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "INVESTIGATING":
    case "UNDER_REVIEW":
    case "ASSIGNED":
    case "WATCHLIST":
      colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
      break;
    default:
      colorClass = "bg-slate-100 text-slate-700 border-slate-200";
  }

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.8 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium font-mono-code border rounded ${colorClass} ${sizeClass}`}
    >
      {norm.replace(/_/g, " ")}
    </span>
  );
};
