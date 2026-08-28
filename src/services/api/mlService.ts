/**
 * mlService.ts — Production ML Inference & API Client
 * Connects the ARVIX React Frontend to the FastAPI ML backend on port 8000.
 */

import type { Transaction } from "../../types/transaction";

const API_BASE_URL = import.meta.env.VITE_ML_API_URL || "";

export interface ModelHealthResponse {
  status: "ready" | "initializing" | "error" | "offline";
  active_models: string[];
  model_versions: {
    pol_detector: string;
    graph_detector: string;
    fusion_engine: string;
    pipeline_precision_target: string;
  };
  baselines_loaded: number;
  total_predictions: number;
  avg_inference_latency_ms: number;
  uptime_since: string;
  features_evaluated: {
    pol_features: number;
    graph_features: number;
    fusion_features: number;
  };
}

export interface MLPredictionResult {
  transaction_id: string;
  risk_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  fraud_probability: number;
  pol_anomaly_score: number;
  graph_anomaly_score: number;
  prediction_status: string;
  is_anomaly: boolean;
  inference_time_ms: number;
  feature_signals: Array<{
    id: string;
    name: string;
    impact: number;
    description: string;
  }>;
  model_metadata: {
    engine_version: string;
    pol_version: string;
    graph_version: string;
    fusion_version: string;
  };
}

class MLService {
  private isOnline: boolean = false;

  public async getHealth(): Promise<ModelHealthResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/model/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      const data = await res.json();
      this.isOnline = data.status === "ready";
      return data;
    } catch (err) {
      this.isOnline = false;
      return null;
    }
  }

  public getStatus(): "ONLINE" | "OFFLINE" {
    return this.isOnline ? "ONLINE" : "OFFLINE";
  }

  public async predictTransaction(tx: Partial<Transaction>): Promise<MLPredictionResult | null> {
    try {
      const payload = {
        transaction_id: tx.transaction_id || `TXN_${Date.now()}`,
        utr: tx.utr || `UTR${Date.now()}`,
        timestamp: tx.timestamp || new Date().toISOString(),
        sender_vpa: tx.sender_vpa || "user_default@upi",
        sender_account_id: tx.sender_account_id || "ACC_DEFAULT",
        receiver_vpa: tx.receiver_vpa || "merchant_default@upi",
        receiver_account_id: tx.receiver_account_id || "ACC_RECEIVER",
        amount: Number(tx.amount || 1000),
        currency: "INR",
        transaction_type: tx.transaction_type || "P2P",
        channel: "UPI_MOBILE",
        status: tx.status || "SUCCESS",
        is_fraud: Boolean(tx.is_fraud),
        fraud_scenario: tx.remarks || null,
      };

      const res = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`ML prediction error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[ML Service] Backend unavailable, using local calculation fallback:", err);
      return null;
    }
  }

  public async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  public async getAccountIntelligence(accountId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/accounts/${accountId}/intelligence`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }
}

export const mlService = new MLService();
