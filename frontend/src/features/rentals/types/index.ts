import { BaseEntity } from "@/types";

export type ContractStatus = "DRAFT" | "PENDING_DEPOSIT" | "ACTIVE" | "EXPIRED" | "TERMINATED" | "RETURNED";

export interface RentalContract extends BaseEntity {
  contract_number: string;
  status: ContractStatus;
  status_display: string;
  start_date: string;
  end_date: string;
  deposit_amount_vnd: number;
  periodic_fee_vnd: number;
  total_paid_vnd: number;
  created_at: string;
}
