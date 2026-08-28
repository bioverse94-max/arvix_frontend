import type { Customer } from "../../types/customer";

export const mockCustomers: Customer[] = [
  {
    customer_id: "CUS-10001",
    first_name: "Rahul",
    last_name: "Sharma",
    email: "rahul@example.com",
    phone: "+917980944548",
    account_id: "ACC10001",
    primary_vpa: "customer1@upi",
    status: "ACTIVE",
    created_at: "2026-08-20T10:00:00Z",
  },
  {
    customer_id: "CUS-10002",
    first_name: "Ananya",
    last_name: "Mehta",
    email: "ananya@example.com",
    phone: "+919123362117",
    account_id: "ACC10002",
    primary_vpa: "customer2@upi",
    status: "ACTIVE",
    created_at: "2026-08-21T10:00:00Z",
  },
];