import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_RPC_SEPOLIA: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_RPC_POLYGON_AMOY: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_RPC_BASE_SEPOLIA: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_HISTORY_PROVIDER: z.enum(['etherscan', 'alchemy', 'mock']).default('mock'),
  NEXT_PUBLIC_ETHERSCAN_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
  NEXT_PUBLIC_KDF_ITERATIONS: z.coerce.number().int().min(310_000).default(600_000),
});

// Next.js inlines NEXT_PUBLIC_* only on explicit property access.
export const env = schema.parse({
  NEXT_PUBLIC_RPC_SEPOLIA: process.env.NEXT_PUBLIC_RPC_SEPOLIA,
  NEXT_PUBLIC_RPC_POLYGON_AMOY: process.env.NEXT_PUBLIC_RPC_POLYGON_AMOY,
  NEXT_PUBLIC_RPC_BASE_SEPOLIA: process.env.NEXT_PUBLIC_RPC_BASE_SEPOLIA,
  NEXT_PUBLIC_HISTORY_PROVIDER: process.env.NEXT_PUBLIC_HISTORY_PROVIDER || undefined,
  NEXT_PUBLIC_ETHERSCAN_API_KEY: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_KDF_ITERATIONS: process.env.NEXT_PUBLIC_KDF_ITERATIONS || undefined,
});
