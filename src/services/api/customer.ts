import { mockCustomers } from "../../data/mock/customers";
import type { Customer } from "../../types/customer";

export async function getCustomers(): Promise<Customer[]> {
  return mockCustomers;
}