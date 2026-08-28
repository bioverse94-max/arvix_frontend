import { mockTransactions } from "../data/mock/transactions";
import type { Transaction, TransactionSignal } from "../types/transaction";
import { mlService } from "./api/mlService";

type TransactionListener = (tx: Transaction) => void;

class TransactionService {
  private transactions: Transaction[] = [...mockTransactions];
  private listeners: Set<TransactionListener> = new Set();
  private streamInterval: ReturnType<typeof setInterval> | null = null;
  private isStreaming: boolean = false;

  public async getTransactions(): Promise<Transaction[]> {
    try {
      const res = await fetch("/api/transactions?page_size=100");
      if (res.ok) {
        const data = await res.json();
        if (data && data.transactions && data.transactions.length > 0) {
          const apiTxns: Transaction[] = data.transactions.map((t: Record<string, unknown>) => {
            const riskScore = Math.round(Number(t.risk_score || 15));
            const calculatedLevel: Transaction["risk_level"] =
              (t.risk_level as Transaction["risk_level"]) ||
              (riskScore >= 80 ? "CRITICAL" : riskScore >= 50 ? "HIGH" : riskScore >= 30 ? "MEDIUM" : "LOW");

            return {
              transaction_id: String(t.transaction_id),
              utr: `UTR_${String(t.transaction_id).slice(-8)}`,
              timestamp: String(t.timestamp),
              sender_vpa: `${String(t.sender_account_id)}@upi`,
              sender_account_id: String(t.sender_account_id),
              sender_bank: "HDFC Bank",
              sender_name: `Account ${String(t.sender_account_id)}`,
              receiver_vpa: `${String(t.receiver_account_id)}@upi`,
              receiver_account_id: String(t.receiver_account_id),
              receiver_bank: "ICICI Bank",
              receiver_name: `Account ${String(t.receiver_account_id)}`,
              amount: Number(t.amount),
              currency: "INR",
              transaction_type: "P2P",
              channel: "UPI_MOBILE",
              status: t.status === "SUCCESS" ? "SUCCESS" : "HELD_STEP_UP",
              device_id: "DEV_APP",
              is_fraud: Boolean(t.is_fraud),
              risk_score: riskScore,
              risk_level: calculatedLevel,
              pattern_score: Math.round(Number((Number(t.pol_anomaly_score) || 0.1) * 100)),
              graph_score: Math.round(Number((Number(t.graph_anomaly_score) || 0.1) * 100)),
              fraud_probability: riskScore / 100,
              inference_time_ms: 14.5,
              model_version: "ARVIX-Ensemble-v1.0",
              pol_anomaly_score: Number(t.pol_anomaly_score) || 0.1,
              graph_anomaly_score: Number(t.graph_anomaly_score) || 0.1,
              signals: ((t.fraud_reasons as string[]) || []).map((reason: string, idx: number) => ({
                id: `SIG_${idx}`,
                name: "ML Fraud Signal",
                category: reason.includes("Graph") ? "GRAPH_TOPOLOGY" : "PATTERN_OF_LIFE",
                impactScore: 85,
                description: reason,
              })),
            };
          });

          this.transactions = apiTxns;
          return apiTxns;
        }
      }
    } catch (err) {
      console.warn("[TransactionService] Generator API offline, falling back to static mock data:", err);
    }
    return [...this.transactions];
  }

  public async triggerSyntheticGeneration(options?: { num_accounts?: number; num_transactions?: number }): Promise<Transaction[]> {
    try {
      const res = await fetch("/api/generator/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_accounts: options?.num_accounts || 100,
          num_transactions: options?.num_transactions || 200,
          scenarios: ["mule_network", "account_takeover", "circular_flow"],
        }),
      });

      if (!res.ok) throw new Error(`Generation failed: ${res.statusText}`);
      
      // Fetch the newly generated transactions
      const freshTxns = await this.getTransactions();
      if (freshTxns.length > 0) {
        this.emitTransaction(freshTxns[0]);
      }
      return freshTxns;
    } catch (err) {
      console.error("[TransactionService] Synthetic generation error, using fallback:", err);
      return this.getTransactions();
    }
  }

  public async getTransactionById(id: string): Promise<Transaction | undefined> {
    const list = await this.getTransactions();
    return list.find((t) => t.transaction_id === id);
  }

  public subscribe(listener: TransactionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emitTransaction(tx: Transaction) {
    this.transactions = [tx, ...this.transactions];
    this.listeners.forEach((listener) => listener(tx));
  }

  public startLiveSimulation(intervalMs: number = 3000) {
    if (this.isStreaming) return;
    this.isStreaming = true;

    this.streamInterval = setInterval(async () => {
      const isAnomalous = Math.random() < 0.30;
      const amount = isAnomalous
        ? Math.floor(Math.random() * 65000) + 25000
        : Math.floor(Math.random() * 3500) + 150;
      
      const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase();
      const banks = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda"];
      const senderBank = banks[Math.floor(Math.random() * banks.length)];
      const receiverBank = isAnomalous ? "ICICI Bank" : banks[Math.floor(Math.random() * banks.length)];

      const candidateTx: Partial<Transaction> = {
        transaction_id: `TXN_${randomHex}`,
        utr: `UTR${Date.now()}${Math.floor(Math.random() * 100)}`,
        timestamp: new Date().toISOString(),
        sender_vpa: `user_${Math.floor(Math.random() * 9000) + 1000}@${senderBank.toLowerCase().replace(/\s/g, "")}`,
        sender_account_id: `ACC_USR_${Math.floor(Math.random() * 900) + 100}`,
        sender_bank: senderBank,
        sender_name: `Remitter User ${Math.floor(Math.random() * 900) + 100}`,
        receiver_vpa: isAnomalous ? "rohit.kumar@icici" : `merchant_${Math.floor(Math.random() * 20)}@upi`,
        receiver_account_id: isAnomalous ? "ACC_8A91F2" : `ACC_MERCH_${Math.floor(Math.random() * 20)}`,
        receiver_bank: receiverBank,
        receiver_name: isAnomalous ? "Rohit Kumar (Flagged Mule)" : `Merchant Store #${Math.floor(Math.random() * 20)}`,
        amount,
        currency: "INR",
        transaction_type: isAnomalous ? "P2P" : "P2M",
        channel: "UPI_MOBILE",
        status: "SUCCESS",
        device_id: `DEV_${Math.floor(Math.random() * 90000)}`,
        is_fraud: isAnomalous,
      };

      // Call the real ML inference engine
      const mlPrediction = await mlService.predictTransaction(candidateTx);

      let finalRiskScore: number;
      let finalRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      let polScore = 10;
      let graphScore = 10;
      let fraudProb = 0.12;
      let signals: TransactionSignal[] = [];
      let inferenceTime = 18.2;
      let modelVersion = "ARVIX-ML-v2.4";

      if (mlPrediction) {
        finalRiskScore = mlPrediction.risk_score;
        finalRiskLevel = mlPrediction.risk_level;
        polScore = Math.round(mlPrediction.pol_anomaly_score * 100);
        graphScore = Math.round(mlPrediction.graph_anomaly_score * 100);
        fraudProb = mlPrediction.fraud_probability;
        inferenceTime = mlPrediction.inference_time_ms;
        modelVersion = mlPrediction.model_metadata.fusion_version;
        signals = mlPrediction.feature_signals.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.id.includes("VELOCITY")
            ? "VELOCITY"
            : s.id.includes("CYCLE")
            ? "GRAPH_TOPOLOGY"
            : "PATTERN_OF_LIFE",
          impactScore: s.impact,
          description: s.description,
        }));
      } else {
        finalRiskScore = isAnomalous ? Math.floor(Math.random() * 25) + 72 : Math.floor(Math.random() * 25) + 5;
        finalRiskLevel = finalRiskScore >= 80 ? "CRITICAL" : finalRiskScore >= 60 ? "HIGH" : finalRiskScore >= 30 ? "MEDIUM" : "LOW";
      }

      const fullTx: Transaction = {
        transaction_id: candidateTx.transaction_id!,
        utr: candidateTx.utr!,
        timestamp: candidateTx.timestamp!,
        sender_vpa: candidateTx.sender_vpa!,
        sender_account_id: candidateTx.sender_account_id!,
        sender_bank: candidateTx.sender_bank!,
        sender_name: candidateTx.sender_name,
        receiver_vpa: candidateTx.receiver_vpa!,
        receiver_account_id: candidateTx.receiver_account_id!,
        receiver_bank: candidateTx.receiver_bank!,
        receiver_name: candidateTx.receiver_name,
        amount: candidateTx.amount!,
        currency: "INR",
        transaction_type: candidateTx.transaction_type!,
        channel: candidateTx.channel!,
        status: finalRiskScore >= 80 ? "HELD_STEP_UP" : "SUCCESS",
        device_id: candidateTx.device_id!,
        is_fraud: isAnomalous,
        risk_score: finalRiskScore,
        risk_level: finalRiskLevel,
        pattern_score: polScore,
        graph_score: graphScore,
        fraud_probability: fraudProb,
        inference_time_ms: inferenceTime,
        model_version: modelVersion,
        pol_anomaly_score: polScore / 100,
        graph_anomaly_score: graphScore / 100,
        signals,
      };

      this.emitTransaction(fullTx);
    }, intervalMs);
  }

  public stopLiveSimulation() {
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }
    this.isStreaming = false;
  }
}

export const transactionService = new TransactionService();
