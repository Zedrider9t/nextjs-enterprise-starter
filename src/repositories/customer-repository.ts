import type {
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
} from "@/domain/customer";

export interface CustomerRepository {
  create(input: CreateCustomerInput): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  list(): Promise<Customer[]>;
  update(id: string, input: UpdateCustomerInput): Promise<Customer | null>;
  delete(id: string): Promise<boolean>;
}
