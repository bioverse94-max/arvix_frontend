export interface Customer {
  customer_id: string;

  first_name: string;
  last_name: string;

  email: string;
  phone: string;

  account_id?: string;
  primary_vpa?: string;

  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";

  created_at: string;
}