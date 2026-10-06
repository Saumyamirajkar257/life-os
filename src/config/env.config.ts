/**
 * @file env.config.ts
 * @description Type-safe environment variable validation schema for Aura Core using Zod.
 * @module AuraCore/Config/Env
 */

import { z } from 'zod';

export const envSchema = z.object({
  VITE_APP_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  VITE_APP_URL: z.string().optional(),
  VITE_FIREBASE_API_KEY: z.string().optional().default('stub-api-key-placeholder'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional().default('aura-core-stub.firebaseapp.com'),
  VITE_FIREBASE_PROJECT_ID: z.string().optional().default('aura-core-stub'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional().default('aura-core-stub.appspot.com'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional().default('000000000000'),
  VITE_FIREBASE_APP_ID: z.string().optional().default('1:000000000000:web:0000000000000000000000'),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates and extracts environment variables safely.
 */
export function parseEnv(): EnvConfig {
  const envObj = {
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV || import.meta.env.MODE,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const parsed = envSchema.safeParse(envObj);

  if (!parsed.success) {
    console.warn('[Aura Core Env Warning] Environment variables validation notice:', parsed.error.format());
    return envSchema.parse({});
  }

  return parsed.data;
}

export const ENV = parseEnv();
