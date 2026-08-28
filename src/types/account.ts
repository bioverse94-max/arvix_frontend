import type { RiskLevel } from "./transaction";
import type { AnomalyMetric, RiskBreakdown } from "./fraud";

export type AccountStatus = "ACTIVE" | "WATCHLIST" | "STEP_UP_REQUIRED" | "HELD" | "FROZEN";
export type AccountRole = "MULE" | "VICTIM" | "COLLECTION" | "NORMAL" | "MERCHANT";

export interface AccountProfile {
  account_id: string;
  vpa: string;
  holder_name: string;
  bank_name: string;
  ifsc_code: string;
  account_type: "SAVINGS" | "CURRENT" | "PPI_WALLET";
  created_at: string;
  status: AccountStatus;
  role: AccountRole;
  risk_score: number;
  risk_level: RiskLevel;
  risk_breakdown: RiskBreakdown;
  metrics: AnomalyMetric[];
  historical_stats: {
    avg_monthly_inflow: number;
    avg_monthly_outflow: number;
    avg_contacts: number;
    avg_txns_per_day: number;
    avg_residence_time_hours: number;
    historical_passthrough_ratio: number;
  };
  current_24h_stats: {
    today_inflow: number;
    today_outflow: number;
    today_unique_senders: number;
    today_unique_receivers: number;
    today_txns_count: number;
    current_passthrough_ratio: number;
    avg_forward_time_mins: number;
  };
  cluster_id?: string;
  tags: string[];
}
