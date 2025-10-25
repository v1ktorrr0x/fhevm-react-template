import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFhevmClient } from "../../src/react/useFhevmClient";
import { useEncrypt } from "../../src/react/useEncrypt";
import { useDecrypt } from "../../src/react/useDecrypt";

/**
 * React Hooks Integration Tests
 * 
 * Tests real-world React hook usage patterns.
 * Focuses on how developers will actually use these hooks.
 */

describe("React Hooks - Real World Usage", () => {
  const SEPOLIA_RPC = "https://sepolia.infura.io/v3/test";
  const CHAIN_ID = 11155111;

  describe("useFhevmClient Hook", () => {
    it("should initialize with loading status", () => {
      const { result } = renderHook(() =>
        useFhevmClient({
          provider: SEPOLIA_RPC,
          chainId: CHAIN_ID,
        })
      );

      expect(result.current.status).toBeDefined();
      expect(result.current.client).toBeUndefined();
    });

    it("should handle disabled state", () => {
      const { result } = renderHook(() =>
        useFhevmClient({
          provider: SEPOLIA_RPC,
          chainId: CHAIN_ID,
          enabled: false,
        })
      );

      expect(result.current.status).toBe("idle");
      expect(result.current.client).toBeUndefined();
    });

    it("should provide refresh function", () => {
      const { result } = renderHook(() =>
        useFhevmClient({
          provider: SEPOLIA_RPC,
          chainId: CHAIN_ID,
        })
      );

      expect(result.current.refresh).toBeDefined();
      expect(typeof result.current.refresh).toBe("function");
    });
  });

  describe("useEncrypt Hook", () => {
    it("should provide encryption methods", () => {
      const { result } = renderHook(() =>
        useEncrypt({
          client: undefined,
          contractAddress: "0x123",
          userAddress: "0x456",
        })
      );

      expect(result.current.encrypt).toBeDefined();
      expect(result.current.encryptU32).toBeDefined();
      expect(result.current.encryptBool).toBeDefined();
      expect(result.current.canEncrypt).toBe(false);
    });

    it("should indicate when encryption is ready", () => {
      const { result } = renderHook(() =>
        useEncrypt({
          client: undefined,
          contractAddress: undefined,
          userAddress: undefined,
        })
      );

      expect(result.current.canEncrypt).toBe(false);
    });
  });

  describe("useDecrypt Hook", () => {
    it("should provide decryption methods", () => {
      const { result } = renderHook(() =>
        useDecrypt({
          client: undefined,
          signer: undefined as any,
        })
      );

      expect(result.current.userDecrypt).toBeDefined();
      expect(result.current.publicDecrypt).toBeDefined();
      expect(result.current.isDecrypting).toBe(false);
    });
  });
});
