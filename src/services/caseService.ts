import { mockCases } from "../data/mock/cases";
import type { FraudCase, CaseStatus, CaseNote } from "../types/case";
import { API_BASE_URL } from "../config";

class CaseService {
  private cases: FraudCase[] = [...mockCases];

  public async getCases(): Promise<FraudCase[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/cases?page_size=100`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.cases && data.cases.length > 0) {
          const apiCases: FraudCase[] = data.cases.map((c: any) => ({
            case_id: c.case_id,
            title: c.title,
            primary_account_id: c.alert_id,
            primary_vpa: "flagged_user@upi",
            holder_name: "Investigated Account",
            bank_name: "NPCI Partner",
            risk_score: c.priority === "CRITICAL" ? 95 : c.priority === "HIGH" ? 78 : 55,
            risk_level: c.priority === "CRITICAL" ? "CRITICAL" : c.priority === "HIGH" ? "HIGH" : "MEDIUM",
            priority: c.priority,
            status: c.status === "OPEN" ? "NEW" : c.status === "INVESTIGATING" ? "INVESTIGATING" : c.status === "CLOSED_CONFIRMED" ? "RESOLVED_FROZEN" : c.status === "CLOSED_FALSE_POSITIVE" ? "CLEARED_LEGITIMATE" : "ASSIGNED",
            created_at: c.created_at,
            updated_at: c.updated_at,
            amount_at_risk: 45000,
            trigger_summary: c.description || "Flagged for investigative review",
            related_account_ids: [],
            related_transaction_ids: [],
            evidence_signals: [],
            timeline: [],
            notes: [],
          }));
          return [...apiCases, ...this.cases.filter(m => !apiCases.some(apiC => apiC.case_id === m.case_id))];
        }
      }
    } catch (err) {
      console.warn("[CaseService] Using local fallback cases:", err);
    }
    return [...this.cases];
  }

  public async getCaseById(id: string): Promise<FraudCase | undefined> {
    try {
      const res = await fetch(`${API_BASE_URL}/cases/${id}`);
      if (res.ok) {
        const c = await res.json();
        if (c) {
          return {
            case_id: c.case_id,
            title: c.title,
            primary_account_id: c.alert_id,
            primary_vpa: "flagged_user@upi",
            holder_name: "Investigated Account",
            bank_name: "NPCI Partner",
            risk_score: c.priority === "CRITICAL" ? 95 : c.priority === "HIGH" ? 78 : 55,
            risk_level: c.priority === "CRITICAL" ? "CRITICAL" : c.priority === "HIGH" ? "HIGH" : "MEDIUM",
            priority: c.priority,
            status: c.status === "OPEN" ? "NEW" : c.status === "INVESTIGATING" ? "INVESTIGATING" : c.status === "CLOSED_CONFIRMED" ? "RESOLVED_FROZEN" : c.status === "CLOSED_FALSE_POSITIVE" ? "CLEARED_LEGITIMATE" : "ASSIGNED",
            created_at: c.created_at,
            updated_at: c.updated_at,
            amount_at_risk: 45000,
            trigger_summary: c.description || "Flagged for investigative review",
            related_account_ids: [],
            related_transaction_ids: [],
            evidence_signals: [],
            timeline: [],
            notes: [],
          };
        }
      }
    } catch (err) {
      // fallback
    }
    return this.cases.find((c) => c.case_id === id);
  }

  public async updateCaseStatus(caseId: string, status: CaseStatus): Promise<boolean> {
    try {
      const backendStatus = status === "NEW" ? "OPEN" : status === "RESOLVED_FROZEN" ? "CLOSED_CONFIRMED" : status === "CLEARED_LEGITIMATE" ? "CLOSED_FALSE_POSITIVE" : "INVESTIGATING";
      await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: backendStatus }),
      });
    } catch (e) {
      console.warn("[CaseService] Could not sync case status with API:", e);
    }

    const c = this.cases.find((item) => item.case_id === caseId);
    if (c) {
      c.status = status;
      c.updated_at = new Date().toISOString();
      return true;
    }
    return true;
  }

  public async addCaseNote(caseId: string, noteText: string, authorName: string = "Investigator"): Promise<boolean> {
    try {
      await fetch(`/api/cases/${caseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText, actor: authorName }),
      });
    } catch (e) {
      console.warn("[CaseService] Could not sync note with API:", e);
    }

    const c = this.cases.find((item) => item.case_id === caseId);
    if (c) {
      const note: CaseNote = {
        id: `NOTE_${Date.now()}`,
        author: authorName,
        role: "Fraud Specialist",
        timestamp: new Date().toISOString(),
        text: noteText,
      };
      c.notes = [note, ...c.notes];
      c.updated_at = new Date().toISOString();
      return true;
    }
    return true;
  }

  public createCase(newCase: FraudCase): void {
    this.cases = [newCase, ...this.cases];
  }
}

export const caseService = new CaseService();
