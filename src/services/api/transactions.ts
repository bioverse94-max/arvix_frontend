import { mockTransactions } from "../../data/mock/transactions";
import type { Transaction } from "../../types/transaction";

export async function getTransactions(): Promise<Transaction[]> {
  return mockTransactions;
}