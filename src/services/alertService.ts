import { mockFraudAlerts } from "../data/mock/fraudAlerts";
import type { FraudAlert, AlertStatus } from "../types/fraud";
import { API_BASE_URL } from "../config";

type AlertListener = (alert: FraudAlert) => void;

class AlertService {
  private alerts: FraudAlert[] = [...mockFraudAlerts];
  private listeners: Set<AlertListener> = new Set();

  public async getAlerts(): Promise<FraudAlert[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts?page_size=100`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.alerts && data.alerts.length > 0) {
          const apiAlerts: FraudAlert[] = data.alerts.map((a: Record<string, string | number | null | undefined>) => ({
            alert_id: String(a.alert_id),
            transaction_id: String(a.transaction_id),
            account_id: String(a.sender_account_id || a.transaction_id || "ACC_FLAGGED"),
            account_vpa: String(a.sender_vpa || `${String(a.transaction_id || "acc").slice(-6)}@upi`),
            account_name: String(a.sender_account_id ? `Account ${a.sender_account_id}` : "UPI Transactor"),
            bank_name: "NPCI Network",
            risk_score: a.risk_score ? Math.round(Number(a.risk_score)) : a.severity === "CRITICAL" ? 95 : a.severity === "HIGH" ? 75 : 45,
            risk_level: (a.severity === "CRITICAL" ? "CRITICAL" : a.severity === "HIGH" ? "HIGH" : "MEDIUM") as FraudAlert["risk_level"],
            severity: (a.severity || "MEDIUM") as FraudAlert["severity"],
            status: (a.status === "OPEN" ? "NEW" : a.status === "RESOLVED" ? "RESOLVED" : a.status === "DISMISSED" ? "DISMISSED" : "INVESTIGATING") as AlertStatus,
            primary_reason: String(a.title || a.description || a.fraud_scenario || "Suspicious transaction detected"),
            signals: [],
            amount: a.amount ? Number(a.amount) : 25000,
            detected_at: String(a.created_at || new Date().toISOString()),
            assigned_to: a.assigned_to ? String(a.assigned_to) : undefined,
          }));
          this.alerts = apiAlerts;
          return apiAlerts;
        }
      }
    } catch (err) {
      console.warn("[AlertService] Using local fallback alerts:", err);
    }
    return [...this.alerts];
  }

  public subscribe(listener: AlertListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emitAlert(alert: FraudAlert) {
    this.alerts = [alert, ...this.alerts];
    this.listeners.forEach((l) => l(alert));
  }

  public async updateAlertStatus(alertId: string, status: AlertStatus): Promise<boolean> {
    try {
      const backendStatus = status === "NEW" ? "OPEN" : status === "RESOLVED" ? "RESOLVED" : status === "DISMISSED" ? "DISMISSED" : "INVESTIGATING";
      await fetch(`/api/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: backendStatus }),
      });
    } catch (e) {
      console.warn("[AlertService] Could not sync status with API:", e);
    }

    const alert = this.alerts.find((a) => a.alert_id === alertId);
    if (alert) {
      alert.status = status;
      return true;
    }
    return true;
  }
}

export const alertService = new AlertService();
