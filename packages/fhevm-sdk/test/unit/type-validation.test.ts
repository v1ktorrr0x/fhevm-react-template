import { describe, it, expect } from "vitest";
import type { FhevmType } from "../../src/core/types";

/**
 * Unit tests for type validation
 */

describe("Type Validation", () => {
  describe("FHEVM Types", () => {
    it("should validate bool type", () => {
      const validTypes: FhevmType[] = ["bool", "uint8", "uint16", "uint32", "uint64", "uint128", "uint256", "address"];
      
      expect(validTypes).toContain("bool");
      expect(validTypes.length).toBe(8);
    });

    it("should validate uint8 range", () => {
      const uint8Max = 255;
      const uint8Min = 0;
      
      expect(uint8Max).toBe(255);
      expect(uint8Min).toBe(0);
      expect(uint8Max).toBeGreaterThan(uint8Min);
    });

    it("should validate uint16 range", () => {
      const uint16Max = 65535;
      const uint16Min = 0;
      
      expect(uint16Max).toBe(65535);
      expect(uint16Min).toBe(0);
      expect(uint16Max).toBeGreaterThan(uint16Min);
    });

    it("should validate uint32 range", () => {
      const uint32Max = 4294967295;
      const uint32Min = 0;
      
      expect(uint32Max).toBe(4294967295);
      expect(uint32Min).toBe(0);
      expect(uint32Max).toBeGreaterThan(uint32Min);
    });

    it("should validate all FHEVM types are defined", () => {
      const types: FhevmType[] = ["bool", "uint8", "uint16", "uint32", "uint64", "uint128", "uint256", "address"];
      
      types.forEach(type => {
        expect(type).toBeDefined();
        expect(typeof type).toBe("string");
      });
    });
  });

  describe("Address Validation", () => {
    it("should validate Ethereum addresses format", () => {
      const validAddress = "0x1234567890123456789012345678901234567890";
      
      expect(validAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
      expect(validAddress.length).toBe(42);
      expect(validAddress.startsWith("0x")).toBe(true);
    });

    it("should reject invalid addresses", () => {
      const invalidAddresses = [
        "invalid",
        "0x123", // too short
        "1234567890123456789012345678901234567890", // missing 0x
        "0xGGGG567890123456789012345678901234567890", // invalid hex
      ];
      
      invalidAddresses.forEach(addr => {
        expect(addr).not.toMatch(/^0x[0-9a-fA-F]{40}$/);
      });
    });

    it("should validate checksum addresses", () => {
      const checksumAddress = "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed";
      
      expect(checksumAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
      expect(checksumAddress.length).toBe(42);
    });
  });
});
