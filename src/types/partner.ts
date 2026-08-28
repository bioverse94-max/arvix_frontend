export type PartnerType = "CUSTOMER" | "INSTITUTION";

export type PartnerStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "INACTIVE";

export interface Partner {
  partner_id: string;

  first_name: string;
  last_name: string;

  email: string;
  phone: string;

  partner_type: PartnerType;
  status: PartnerStatus;

  organization_name?: string | null;

  created_at: string;
  updated_at?: string;
}