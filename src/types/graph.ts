import type { AccountRole } from "./account";
import type { RiskLevel } from "./transaction";

export interface GraphNode {
  id: string; // account_id
  vpa: string;
  name: string;
  bank: string;
  role: AccountRole;
  risk_score: number;
  risk_level: RiskLevel;
  in_degree: number;
  out_degree: number;
  total_inflow: number;
  total_outflow: number;
  passthrough_ratio: number;
  cluster_id?: string;
  val?: number; // size in force graph
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  transaction_id: string;
  amount: number;
  timestamp: string;
  is_fraud: boolean;
  velocity_rank?: number;
  color?: string;
}

export interface FraudCluster {
  cluster_id: string;
  name: string;
  mule_account_id: string;
  mule_vpa: string;
  victim_count: number;
  collection_count: number;
  total_funneled_amount: number;
  avg_residence_time_mins: number;
  conviction_score: number;
  status: "ACTIVE" | "CONTAINED" | "DISRUPTED";
  first_detected: string;
  last_activity: string;
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
