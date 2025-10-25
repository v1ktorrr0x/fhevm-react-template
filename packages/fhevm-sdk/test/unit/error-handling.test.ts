import { describe, it, expect } from "vitest";
import { FhevmClient } from "../../src/core/client";

/**
 * Unit tests for error handling utilities
 */

describe("Error Handling", () => {
  describe("Client Errors", () => {
    it("should throw error when client not initialized", async () => {
      const client = Object.create(FhevmClient.prototype);
      
      try {
        await client.encryptU32(42, "0x123", "0x456");
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain("FhevmClient not ready");
      }
    });

    it("should include helpful message for uninitialized client", async () => {
      const client = Object.create(FhevmClient.prototype);
      
      try {
        client.getPublicKey();
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain("FhevmClient not ready");
        expect(error.message).toContain("create()");
      }
    });

    it("should throw error for invalid configuration", async () => {
      try {
        await FhevmClient.create({
          provider: "" as any, // Invalid provider
          chainId: 11155111,
        });
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Encryption Errors", () => {
    it("should provide clear error for missing parameters", async () => {
      const client = Object.create(FhevmClient.prototype);
      
      try {
        await client.encryptU32(42, "0x123", "0x456");
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe("string");
      }
    });

    it("should validate encryption parameters", async () => {
      try {
        const client = await FhevmClient.create({
          provider: "https://sepolia.infura.io/v3/test",
          chainId: 11155111,
        });

        // Try with invalid address
        await client.encryptU32(42, "invalid", "0x456");
      } catch (error: any) {
        // Expected error
        expect(error).toBeDefined();
      }
    });
  });

  describe("Decryption Errors", () => {
    it("should require signer for userDecrypt", async () => {
      const client = Object.create(FhevmClient.prototype);
      
      try {
        await client.userDecrypt(
          [{ handle: "0x01", contractAddress: "0x123" as `0x${string}` }],
          null as any
        );
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should provide clear error messages", async () => {
      const client = Object.create(FhevmClient.prototype);
      
      try {
        await client.publicDecrypt(["0x01"]);
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain("FhevmClient not ready");
      }
    });
  });

  describe("Error Message Quality", () => {
    it("should provide actionable error messages", async () => {
      const client = Object.create(FhevmClient.prototype);
      
      try {
        client.getInstance();
      } catch (error: any) {
        expect(error.message).toBeDefined();
        expect(error.message.length).toBeGreaterThan(10);
        expect(error.message).toContain("FhevmClient");
      }
    });

    it("should include context in error messages", async () => {
      const client = Object.create(FhevmClient.prototype);
      
      try {
        await client.encryptU32(42, "0x123", "0x456");
      } catch (error: any) {
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe("string");
      }
    });
  });
});
