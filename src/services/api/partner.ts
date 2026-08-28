import { mockPartners } from "../../data/mock/partners";
import type { Partner } from "../../types/partner";

export async function getPartners(): Promise<Partner[]> {
  return mockPartners;
}