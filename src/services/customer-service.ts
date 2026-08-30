import type { CreateCustomerInput, Customer } from "@/domain/customer";
import type { CustomerRepository } from "@/repositories/customer-repository";

export class CustomerConflictError extends Error {
  constructor(message = "A customer with this email already exists") {
    super(message);
    this.name = "CustomerConflictError";
  }
}

export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async register(input: CreateCustomerInput): Promise<Customer> {
    const existing = await this.repository.findByEmail(input.email);
    if (existing) {
      throw new CustomerConflictError();
    }

    return this.repository.create({
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
    });
  }

  async listActive(): Promise<Customer[]> {
    const customers = await this.repository.list();
    return customers.filter((customer) => customer.status === "active");
  }
}
