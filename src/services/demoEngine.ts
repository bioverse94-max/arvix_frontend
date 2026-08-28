import type { DemoSimulationState } from "../types/system";

export const DEMO_STAGES = [
  {
    stage: 1,
    title: "Stage 1: Normal Baseline Network",
    description: "Stable user communities with recurring low-volume P2P and P2M transactions. High clustering, predictable cadence, low risk scores (10-18).",
    riskScore: 14,
    muleStatus: "NORMAL",
    inflow: "₹4,800 / mo",
    senders: "3 regular contacts",
  },
  {
    stage: 2,
    title: "Stage 2: Abnormal Inbound Transactions Begin",
    description: "Multiple geographically dispersed accounts begin sending high-ticket transfers (₹15,000 - ₹48,500) to account ACC_8A91F2 with suspicious memo references.",
    riskScore: 48,
    muleStatus: "MONITORED",
    inflow: "₹25,000 in 15 mins",
    senders: "8 new contacts",
  },
  {
    stage: 3,
    title: "Stage 3: Pattern-of-Life Score Rises",
    description: "The behavioral anomaly model flags significant divergence from 90-day baseline rhythm. Inbound diversity reaches +8.4 Z-score.",
    riskScore: 68,
    muleStatus: "WATCHLIST",
    inflow: "₹52,000 today",
    senders: "18 unique senders",
  },
  {
    stage: 4,
    title: "Stage 4: Graph Anomaly & Funnel Appears",
    description: "Graph Topology Engine identifies that ACC_8A91F2 has formed a structural funnel bottleneck with high in-degree and near-zero clustering coefficient.",
    riskScore: 78,
    muleStatus: "SUSPECT_MULE",
    inflow: "₹72,400 today",
    senders: "26 unique senders",
  },
  {
    stage: 5,
    title: "Stage 5: Mule Funnel Cluster Fully Forms",
    description: "6 distinct victim nodes feed into Mule ACC_8A91F2, which begins rapid pass-through preparation to outbound settlement channels.",
    riskScore: 86,
    muleStatus: "MULE_CLUSTER",
    inflow: "₹1,72,400 in cluster",
    senders: "31 unique senders",
  },
  {
    stage: 6,
    title: "Stage 6: Combined Risk Score Hits 91 / 100",
    description: "Weighted fusion model (Pattern 94 + Graph 89 + Pass-Through 95 + Velocity 88) escalates account to CRITICAL RISK tier.",
    riskScore: 91,
    muleStatus: "CRITICAL_MULE",
    inflow: "₹1,72,400",
    senders: "31 unique senders",
  },
  {
    stage: 7,
    title: "Stage 7: Real-Time Operational Alert Dispatched",
    description: "Instant alert ALT_2026_9012 pushed to bank fraud operations queue with detailed SHAP explainability attribution.",
    riskScore: 91,
    muleStatus: "ALERT_TRIGGERED",
    inflow: "₹1,72,400",
    senders: "31 unique senders",
  },
  {
    stage: 8,
    title: "Stage 8: Fraud Investigation Case Auto-Generated",
    description: "Comprehensive Case CASE_UPI_2026_8492 created with timeline, evidence graph, victim roster, and action toolbar (Step-up / Freeze).",
    riskScore: 96,
    muleStatus: "CASE_OPENED",
    inflow: "₹3,48,500 total",
    senders: "14 victims, 2 sinks",
  },
];

type DemoListener = (state: DemoSimulationState) => void;

class DemoEngine {
  private state: DemoSimulationState = {
    stage: 1,
    totalStages: 8,
    title: DEMO_STAGES[0].title,
    description: DEMO_STAGES[0].description,
    isPlaying: false,
    speed: 1,
    highlightedNodeId: undefined,
    highlightedClusterId: undefined,
    generatedAlertCount: 0,
    generatedCaseId: undefined,
  };

  private listeners: Set<DemoListener> = new Set();
  private timer: any = null;

  public getState(): DemoSimulationState {
    return { ...this.state };
  }

  public subscribe(listener: DemoListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  public setStage(stageNum: number) {
    const clamped = Math.max(1, Math.min(DEMO_STAGES.length, stageNum));
    const stageInfo = DEMO_STAGES[clamped - 1];

    this.state.stage = clamped;
    this.state.title = stageInfo.title;
    this.state.description = stageInfo.description;

    if (clamped >= 2) {
      this.state.highlightedNodeId = "ACC_8A91F2";
    } else {
      this.state.highlightedNodeId = undefined;
    }

    if (clamped >= 5) {
      this.state.highlightedClusterId = "CLUSTER_MULE_084";
    }

    if (clamped >= 7) {
      this.state.generatedAlertCount = 1;
    }

    if (clamped >= 8) {
      this.state.generatedCaseId = "CASE_UPI_2026_8492";
    }

    this.notify();
  }

  public startSimulation() {
    if (this.state.isPlaying) return;
    this.state.isPlaying = true;
    this.notify();

    const runStep = () => {
      if (!this.state.isPlaying) return;
      if (this.state.stage < this.state.totalStages) {
        this.setStage(this.state.stage + 1);
        const delay = 4500 / this.state.speed;
        this.timer = setTimeout(runStep, delay);
      } else {
        this.state.isPlaying = false;
        this.notify();
      }
    };

    const delay = 4500 / this.state.speed;
    this.timer = setTimeout(runStep, delay);
  }

  public pauseSimulation() {
    this.state.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public setSpeed(speed: number) {
    this.state.speed = speed;
    this.notify();
  }

  public resetSimulation() {
    this.pauseSimulation();
    this.setStage(1);
  }

  public triggerMuleAttack() {
    this.setStage(5);
  }
}

export const demoEngine = new DemoEngine();
