import type { Partner } from "../../types/partner";

export const mockPartners: Partner[] = [
  {
    partner_id: "PTR-10001",
    first_name: "Rahul",
    last_name: "Sharma",
    email: "rahul@example.com",
    phone: "+917980944548",
    partner_type: "CUSTOMER",
    status: "ACTIVE",
    organization_name: null,
    created_at: "2026-08-20T10:00:00Z",
  },
  {
    partner_id: "PTR-10002",
    first_name: "Ananya",
    last_name: "Mehta",
    email: "ananya@example.com",
    phone: "+919123362117",
    partner_type: "INSTITUTION",
    status: "ACTIVE",
    organization_name: "Example Bank",
    created_at: "2026-08-18T10:00:00Z",
  },
];