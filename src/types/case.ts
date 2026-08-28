import type { RiskLevel } from "./transaction";

export type CaseStatus = "NEW" | "ASSIGNED" | "INVESTIGATING" | "STEP_UP_ISSUED" | "ESCALATED_LE" | "RESOLVED_FROZEN" | "CLEARED_LEGITIMATE";
export type CasePriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  type: "DETECTION" | "SYSTEM" | "INVESTIGATOR" | "ACTION";
}

export interface CaseNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  text: string;
}

export interface FraudCase {
  case_id: string;
  title: string;
  primary_account_id: string;
  primary_vpa: string;
  holder_name: string;
  bank_name: string;
  risk_score: number;
  risk_level: RiskLevel;
  priority: CasePriority;
  status: CaseStatus;
  assigned_investigator?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
  amount_at_risk: number;
  trigger_summary: string;
  cluster_id?: string;
  related_account_ids: string[];
  related_transaction_ids: string[];
  evidence_signals: {
    title: string;
    score: number;
    description: string;
    evidence: string;
  }[];
  timeline: CaseTimelineEvent[];
  notes: CaseNote[];
}
