/**
 * Test utilities and helpers for SDK testing
 */

import { vi } from "vitest";

/**
 * Creates a mock EIP-1193 provider
 */
export function createMockProvider(chainId: number = 31337) {
  return {
    request: vi.fn(async ({ method, params }: any) => {
      if (method === "eth_chainId") {
        return `0x${chainId.toString(16)}`;
      }
      if (method === "eth_accounts") {
        return ["0x1234567890123456789012345678901234567890"];
      }
      return null;
    }),
    on: vi.fn(),
    removeListener: vi.fn(),
  };
}

/**
 * Creates mock contract instance
 */
export function createMockContract() {
  return {
    address: "0x1234567890123456789012345678901234567890",
    interface: {},
    runner: null,
  };
}

/**
 * Waits for condition to be true
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const start = Date.now();
  while (!condition()) {
    if (Date.now() - start > timeout) {
      throw new Error("Timeout waiting for condition");
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

/**
 * Creates mock FHEVM instance
 */
export function createMockFhevmInstance() {
  return {
    encrypt: vi.fn(),
    decrypt: vi.fn(),
    getPublicKey: vi.fn(() => "mock-public-key"),
    getPublicParams: vi.fn(() => "mock-public-params"),
  };
}
