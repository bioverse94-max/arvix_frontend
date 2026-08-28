import type { RiskBreakdown } from "../types/fraud";
import type { RiskLevel } from "../types/transaction";
import { getRiskLevel } from "../styles/designTokens";

class RiskService {
  public calculateRiskScore(params: {
    patternScore: number;
    graphScore: number;
    velocityScore?: number;
    passthroughScore?: number;
    inboundDiversityScore?: number;
  }): RiskBreakdown {
    const patternOfLifeScore = params.patternScore;
    const graphRiskScore = params.graphScore;
    const velocityScore = params.velocityScore ?? Math.min(100, Math.round(patternOfLifeScore * 0.95));
    const passthroughScore = params.passthroughScore ?? Math.min(100, Math.round(graphRiskScore * 1.05));
    const inboundDiversityScore = params.inboundDiversityScore ?? Math.min(100, Math.round((patternOfLifeScore + graphRiskScore) / 2));

    const finalScore = Math.round(
      0.35 * patternOfLifeScore +
      0.35 * graphRiskScore +
      0.15 * passthroughScore +
      0.15 * velocityScore
    );

    const riskLevel: RiskLevel = getRiskLevel(finalScore);

    const shapContributions = [
      {
        feature: "Inbound Sender Diversity",
        description: "Deviates from regular historical contact cluster",
        contribution: Math.round(inboundDiversityScore * 0.28),
        baseline: "2-3 contacts/mo",
        observed: `${Math.round(inboundDiversityScore / 3)} senders`,
      },
      {
        feature: "Pass-Through Ratio",
        description: "Speed and ratio of fund forwarding",
        contribution: Math.round(passthroughScore * 0.24),
        baseline: "20% in 48h",
        observed: `${Math.round(passthroughScore * 0.95)}% in < 20m`,
      },
      {
        feature: "Graph Funnel Centrality",
        description: "Betweenness centrality and network funnel index",
        contribution: Math.round(graphRiskScore * 0.2),
        baseline: "0.02 (Standard)",
        observed: `${(graphRiskScore / 100).toFixed(2)} (Funnel Bottleneck)`,
      },
      {
        feature: "Transaction Velocity",
        description: "Burst rate anomaly over 10-minute window",
        contribution: Math.round(velocityScore * 0.15),
        baseline: "1 txn/day",
        observed: `${Math.round(velocityScore / 5)} txns in burst`,
      },
    ];

    return {
      finalScore,
      riskLevel,
      patternOfLifeScore,
      graphRiskScore,
      velocityScore,
      passthroughScore,
      inboundDiversityScore,
      shapContributions,
    };
  }
}

export const riskService = new RiskService();
