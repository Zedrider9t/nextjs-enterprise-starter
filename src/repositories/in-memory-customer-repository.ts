import { randomUUID } from "node:crypto";
import type {
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
} from "@/domain/customer";
import type { CustomerRepository } from "@/repositories/customer-repository";

export class InMemoryCustomerRepository implements CustomerRepository {
  private readonly customers = new Map<string, Customer>();

  async create(input: CreateCustomerInput): Promise<Customer> {
    const now = new Date();
    const customer: Customer = {
      id: randomUUID(),
      email: input.email,
      name: input.name,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    this.customers.set(customer.id, customer);
    return { ...customer };
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = this.customers.get(id);
    return customer ? { ...customer } : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const normalized = email.trim().toLowerCase();
    const customer = [...this.customers.values()].find(
      (item) => item.email.trim().toLowerCase() === normalized,
    );

    return customer ? { ...customer } : null;
  }

  async list(): Promise<Customer[]> {
    return [...this.customers.values()].map((customer) => ({ ...customer }));
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer | null> {
    const current = this.customers.get(id);
    if (!current) {
      return null;
    }

    const updated: Customer = {
      ...current,
      ...input,
      updatedAt: new Date(),
    };

    this.customers.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }
}
