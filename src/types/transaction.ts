export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING" | "HELD_STEP_UP" | "BLOCKED";

export type TransactionType = "P2P" | "P2M" | "COLLECT" | "MANDATE";

export interface TransactionSignal {
  id: string;
  name: string;
  category: "PATTERN_OF_LIFE" | "GRAPH_TOPOLOGY" | "VELOCITY" | "PASS_THROUGH" | "DEVICE_GEO";
  impactScore: number; // e.g. +27
  description: string;
  historicalValue?: string;
  currentValue?: string;
}

export interface Transaction {
  transaction_id: string;
  utr: string;
  timestamp: string;
  sender_vpa: string;
  sender_account_id: string;
  sender_bank: string;
  sender_name?: string;
  receiver_vpa: string;
  receiver_account_id: string;
  receiver_bank: string;
  receiver_name?: string;
  amount: number;
  currency: string;
  transaction_type: TransactionType;
  channel: string;
  status: TransactionStatus;
  device_id: string;
  ip_address?: string;
  location?: string;
  remarks?: string;
  is_fraud: boolean;
  risk_score: number; // 0 to 100
  risk_level: RiskLevel;
  pattern_score: number;
  graph_score: number;
  signals: TransactionSignal[];
  session_id?: string;
  mule_cluster_id?: string;
  fraud_probability?: number;
  inference_time_ms?: number;
  model_version?: string;
  pol_anomaly_score?: number;
  graph_anomaly_score?: number;
}