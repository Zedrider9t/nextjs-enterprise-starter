export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  email: string;
  name: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  email: string;
  name: string;
}

export interface UpdateCustomerInput {
  email?: string;
  name?: string;
  status?: CustomerStatus;
}
