export interface SystemEngineHealth {
  name: string;
  category: "INGESTION" | "SCORING" | "GRAPH" | "GATEWAY" | "STORAGE";
  status: "OPERATIONAL" | "DEGRADED" | "DOWN";
  latency_ms: number;
  throughput_eps: number;
  error_rate: number;
  uptime_pct: number;
  last_heartbeat: string;
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_id: string;
  actor_name: string;
  action_type: "FREEZE_ACCOUNT" | "STEP_UP_REQUEST" | "ASSIGN_CASE" | "ESCALATE_CASE" | "RESOLVE_CASE" | "CONFIG_CHANGE" | "LOGIN";
  target_id: string;
  target_type: "ACCOUNT" | "TRANSACTION" | "CASE" | "SYSTEM";
  ip_address: string;
  details: string;
  auth_confirmed: boolean;
}

export interface DemoSimulationState {
  stage: number;
  totalStages: number;
  title: string;
  description: string;
  isPlaying: boolean;
  speed: number;
  highlightedNodeId?: string;
  highlightedClusterId?: string;
  generatedAlertCount: number;
  generatedCaseId?: string;
}
