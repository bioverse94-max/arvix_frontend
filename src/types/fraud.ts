import type { RiskLevel, TransactionSignal } from "./transaction";

export type { RiskLevel, TransactionSignal };

export type AlertSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AlertStatus = "NEW" | "INVESTIGATING" | "STEP_UP_SENT" | "ESCALATED" | "RESOLVED" | "DISMISSED";

export interface FraudAlert {
  alert_id: string;
  transaction_id: string;
  account_id: string;
  account_vpa: string;
  account_name: string;
  bank_name: string;
  risk_score: number;
  risk_level: RiskLevel;
  severity: AlertSeverity;
  status: AlertStatus;
  primary_reason: string;
  signals: TransactionSignal[];
  amount: number;
  detected_at: string;
  assigned_to?: string;
  assigned_name?: string;
  mule_cluster_id?: string;
}

export interface RiskBreakdown {
  finalScore: number;
  riskLevel: RiskLevel;
  patternOfLifeScore: number;
  graphRiskScore: number;
  velocityScore: number;
  passthroughScore: number;
  inboundDiversityScore: number;
  shapContributions: {
    feature: string;
    description: string;
    contribution: number;
    baseline: string;
    observed: string;
  }[];
}

export interface AnomalyMetric {
  metric: string;
  normalBaseline: string;
  currentObserved: string;
  deviationPercent: number;
  isAnomaly: boolean;
  unit?: string;
}