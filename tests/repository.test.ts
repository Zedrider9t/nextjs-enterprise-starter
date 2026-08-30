import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryCustomerRepository } from "../src/repositories/in-memory-customer-repository";
import {
  CustomerConflictError,
  CustomerService,
} from "../src/services/customer-service";

test("customer service normalizes and persists new customers", async () => {
  const repository = new InMemoryCustomerRepository();
  const service = new CustomerService(repository);

  const customer = await service.register({
    email: "  Owner@Example.com ",
    name: "  Example Owner  ",
  });

  assert.equal(customer.email, "owner@example.com");
  assert.equal(customer.name, "Example Owner");
  assert.equal(customer.status, "active");

  const stored = await repository.findById(customer.id);
  assert.equal(stored?.email, "owner@example.com");
});

test("customer service prevents duplicate email registrations", async () => {
  const repository = new InMemoryCustomerRepository();
  const service = new CustomerService(repository);

  await service.register({ email: "team@example.com", name: "Team One" });

  await assert.rejects(
    () => service.register({ email: "TEAM@example.com", name: "Team Two" }),
    CustomerConflictError,
  );
});

test("listActive excludes inactive customers", async () => {
  const repository = new InMemoryCustomerRepository();
  const service = new CustomerService(repository);

  const active = await service.register({
    email: "active@example.com",
    name: "Active Customer",
  });
  const inactive = await service.register({
    email: "inactive@example.com",
    name: "Inactive Customer",
  });

  await repository.update(inactive.id, { status: "inactive" });

  const customers = await service.listActive();
  assert.deepEqual(customers.map((customer) => customer.id), [active.id]);
});
