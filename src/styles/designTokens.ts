export const ARVIX_COLORS = {
  // NPCI-Inspired Blue Hierarchy
  primaryBlue: "#0072BC",    // Primary buttons, active navigation, links, key headings
  darkBlue: "#123B63",       // Navigation headers, major section headings
  deepNavy: "#082A49",       // Footer, dark navigation accents, high-importance containers
  lightBlue: "#EAF5FC",      // Highlighted sections, selected states, info badges
  white: "#FFFFFF",          // Primary surface
  lightGrey: "#F5F7FA",      // Main application background
  borderGrey: "#E1E7ED",     // Card borders, table dividers, lines

  // Typography
  textPrimary: "#172B4D",    // Main body & headings
  textSecondary: "#526581",  // Secondary descriptions & labels
  textMuted: "#7B8794",      // Metadata, footnotes, timestamps

  // Semantic Risk Palette (Reserved strictly for fraud telemetry)
  riskLow: "#168A5B",        // Low Risk (0-39)
  riskLowBg: "#E8F8F0",
  riskMedium: "#D99000",     // Medium Risk (40-69)
  riskMediumBg: "#FEF7E6",
  riskHigh: "#D64545",       // High Risk (70-84)
  riskHighBg: "#FDF0F0",
  riskCritical: "#A91D2F",   // Critical Risk (85-100)
  riskCriticalBg: "#FCEAEB",

  // Analytical Graph Colors (Clean & Professional)
  graphBg: "#FFFFFF",
  nodeNormal: "#0072BC",
  nodeSuspicious: "#D99000",
  nodeHighRisk: "#D64545",
  nodeMule: "#A91D2F",
  nodeVictim: "#0284C7",
  nodeCollection: "#526581",
  edgeNormal: "#CBD5E1",
  edgeFraud: "#D64545",
} as const;

export const RISK_THRESHOLDS = {
  LOW_MAX: 39,
  MEDIUM_MAX: 69,
  HIGH_MAX: 84,
  CRITICAL_MAX: 100,
};

export const RISK_LEVEL_CONFIG = {
  LOW: {
    label: "LOW RISK",
    color: "#168A5B",
    bgColor: "#E8F8F0",
    badgeClass: "bg-[#E8F8F0] text-[#168A5B] border-[#A7E3C7]",
  },
  MEDIUM: {
    label: "MEDIUM RISK",
    color: "#D99000",
    bgColor: "#FEF7E6",
    badgeClass: "bg-[#FEF7E6] text-[#D99000] border-[#FCE2A6]",
  },
  HIGH: {
    label: "HIGH RISK",
    color: "#D64545",
    bgColor: "#FDF0F0",
    badgeClass: "bg-[#FDF0F0] text-[#D64545] border-[#F8BABA]",
  },
  CRITICAL: {
    label: "CRITICAL RISK",
    color: "#A91D2F",
    bgColor: "#FCEAEB",
    badgeClass: "bg-[#FCEAEB] text-[#A91D2F] border-[#F5A3AE]",
  },
} as const;

export function getRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (score >= 85) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function getRiskColor(levelOrScore: string | number): string {
  const level = typeof levelOrScore === "number" ? getRiskLevel(levelOrScore) : levelOrScore;
  switch (level) {
    case "CRITICAL": return ARVIX_COLORS.riskCritical;
    case "HIGH": return ARVIX_COLORS.riskHigh;
    case "MEDIUM": return ARVIX_COLORS.riskMedium;
    case "LOW":
    default: return ARVIX_COLORS.riskLow;
  }
}

export function getRiskBgColor(levelOrScore: string | number): string {
  const level = typeof levelOrScore === "number" ? getRiskLevel(levelOrScore) : levelOrScore;
  switch (level) {
    case "CRITICAL": return ARVIX_COLORS.riskCriticalBg;
    case "HIGH": return ARVIX_COLORS.riskHighBg;
    case "MEDIUM": return ARVIX_COLORS.riskMediumBg;
    case "LOW":
    default: return ARVIX_COLORS.riskLowBg;
  }
}
