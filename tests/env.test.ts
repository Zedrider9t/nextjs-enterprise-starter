import test from "node:test";
import assert from "node:assert/strict";
import { parseEnv } from "../src/config/env.js";

test("environment parser applies safe local defaults", () => {
  const result = parseEnv({});

  assert.equal(result.NEXT_PUBLIC_APP_NAME, "Enterprise Starter");
  assert.equal(result.APP_ENV, "development");
  assert.equal(result.APP_URL, "http://localhost:3000");
});

test("environment parser accepts explicit production configuration", () => {
  const result = parseEnv({
    NEXT_PUBLIC_APP_NAME: "Acme Platform",
    APP_ENV: "production",
    APP_URL: "https://app.example.com",
  });

  assert.equal(result.NEXT_PUBLIC_APP_NAME, "Acme Platform");
  assert.equal(result.APP_ENV, "production");
  assert.equal(result.APP_URL, "https://app.example.com");
});

test("environment parser rejects invalid application URLs", () => {
  assert.throws(() =>
    parseEnv({
      APP_URL: "not-a-url",
    }),
  );
});
