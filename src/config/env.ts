import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Enterprise Starter"),
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function parseEnv(input: Record<string, string | undefined>): AppEnv {
  return envSchema.parse(input);
}

export const env = parseEnv({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  APP_ENV: process.env.APP_ENV,
  APP_URL: process.env.APP_URL,
});
