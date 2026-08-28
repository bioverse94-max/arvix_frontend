import { mockSystemEngines, mockAuditLogs } from "../data/mock/systemHealth";
import type { SystemEngineHealth, AuditLogEntry } from "../types/system";

class SystemService {
  private engines: SystemEngineHealth[] = [...mockSystemEngines];
  private auditLogs: AuditLogEntry[] = [...mockAuditLogs];

  public async getEngineHealth(): Promise<SystemEngineHealth[]> {
    try {
      const [modelRes, streamRes] = await Promise.allSettled([
        fetch("/api/model/health"),
        fetch("/api/stream/metrics"),
      ]);

      if (modelRes.status === "fulfilled" && modelRes.value.ok) {
        const data = await modelRes.value.json();
        const scoringEngine = this.engines.find((e) => e.category === "SCORING");
        if (scoringEngine) {
          scoringEngine.status = data.status === "ready" ? "OPERATIONAL" : "DEGRADED";
          scoringEngine.latency_ms = data.avg_inference_latency_ms || 14.2;
        }
      }

      if (streamRes.status === "fulfilled" && streamRes.value.ok) {
        const streamData = await streamRes.value.json();
        const ingestEngine = this.engines.find((e) => e.category === "INGESTION");
        if (ingestEngine) {
          ingestEngine.status = "OPERATIONAL";
          ingestEngine.throughput_eps = Math.round(streamData.current_ingest_tps || 1250);
          ingestEngine.latency_ms = streamData.latency_p50_ms || 0.8;
          ingestEngine.notes = `Active Engine: ${streamData.engine_type} | Peak: ${streamData.peak_ingest_tps} TPS | Backlog: ${streamData.backlog_size}`;
        }
      }
    } catch (e) {
      // fallback
    }
    return [...this.engines];
  }

  public async getAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const res = await fetch("/api/audit-logs?page_size=100");
      if (res.ok) {
        const data = await res.json();
        if (data && data.logs && data.logs.length > 0) {
          const apiLogs: AuditLogEntry[] = data.logs.map((l: any) => ({
            id: l.log_id,
            timestamp: l.timestamp,
            actor_id: l.actor_id || "SYSTEM",
            actor_name: l.actor_name || "Investigator",
            action_type: l.action_type || "CONFIG_CHANGE",
            target_id: l.target_id || "SYSTEM",
            target_type: l.target_type || "SYSTEM",
            ip_address: l.ip_address || "127.0.0.1",
            details: l.details || "Action executed",
            auth_confirmed: l.auth_confirmed !== false,
          }));
          return [...apiLogs, ...this.auditLogs.filter(m => !apiLogs.some(apiL => apiL.id === m.id))];
        }
      }
    } catch (err) {
      console.warn("[SystemService] Using local audit fallback:", err);
    }
    return [...this.auditLogs];
  }

  public async addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    try {
      await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_type: entry.action_type,
          target_type: entry.target_type,
          target_id: entry.target_id,
          details: entry.details,
        }),
      });
    } catch (e) {
      console.warn("[SystemService] Failed to send audit log to API:", e);
    }

    const newLog: AuditLogEntry = {
      id: `AUDIT_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs = [newLog, ...this.auditLogs];
  }
}

export const systemService = new SystemService();
