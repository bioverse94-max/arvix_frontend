import { mockFraudAlerts } from "../../data/mock/fraudAlerts";
import type { FraudAlert } from "../../types/fraud";

export async function getFraudAlerts(): Promise<FraudAlert[]> {
  return mockFraudAlerts;
}