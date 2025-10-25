/**
 * Mock contract helpers for testing
 */

import { vi } from "vitest";

/**
 * Mock FHECounter contract
 */
export function createMockFHECounter() {
    return {
        increment: vi.fn(async () => ({
            wait: vi.fn(async () => ({ status: 1 })),
        })),
        decrement: vi.fn(async () => ({
            wait: vi.fn(async () => ({ status: 1 })),
        })),
        getCounter: vi.fn(async () => "0x1234"),
        address: "0xCounter123456789012345678901234567890",
    };
}

/**
 * Mock ACL contract
 */
export function createMockACL() {
    return {
        allow: vi.fn(async () => true),
        isAllowed: vi.fn(async () => true),
        address: "0xACL1234567890123456789012345678901234",
    };
}
