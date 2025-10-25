/**
 * Node.js Example: Universal FHEVM SDK
 *
 * This example demonstrates how to use the framework-agnostic FHEVM SDK
 * in a plain Node.js environment (no React, no Vue, just JavaScript).
 *
 * Prerequisites:
 * 1. Start Hardhat node: pnpm chain
 * 2. Deploy contracts: pnpm deploy:localhost
 * 3. Run this script: node index.js
 */

// Import directly from built files (workspace package resolution has issues)
import { FhevmClient } from "../../packages/fhevm-sdk/dist/core/client.js";
import { ethers } from "ethers";

// Configuration
// Default: Localhost (for development)
const RPC_URL = "http://localhost:8545";
const CHAIN_ID = 31337;

// For Sepolia testnet, uncomment:
// const RPC_URL = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
// const CHAIN_ID = 11155111;

// FHECounter contract address (update after deployment)
const CONTRACT_ADDRESS = "0xE43452762737f3858B54cFf8C960AF9fBE06B1CE";

// FHECounter ABI (minimal - just what we need)
const CONTRACT_ABI = [
  "function increment(bytes32 inputEuint32, bytes inputProof) external",
  "function decrement(bytes32 inputEuint32, bytes inputProof) external",
  "function getCount() external view returns (bytes32)",
];

async function main() {
  console.log("🚀 Universal FHEVM SDK - Node.js Example\n");

  // Step 1: Connect to Hardhat node
  console.log("📡 Connecting to Hardhat node...");
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const network = await provider.getNetwork();
  console.log(
    `✅ Connected to network: ${network.name} (chainId: ${network.chainId})\n`,
  );

  // Step 2: Get signer (first account from Hardhat)
  const signer = await provider.getSigner(0);
  const userAddress = await signer.getAddress();
  console.log(`👤 Using account: ${userAddress}\n`);

  // Step 3: Initialize FHEVM client
  console.log("🔐 Initializing FHEVM client...");
  const client = await FhevmClient.create({
    provider: RPC_URL,
    chainId: CHAIN_ID,
    mockChains: { 31337: "http://localhost:8545" }, // Enable mock for localhost
  });
  console.log("✅ FHEVM client ready!\n");

  // Step 4: Connect to contract
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  console.log(`📄 Connected to FHECounter at: ${CONTRACT_ADDRESS}\n`);

  // Step 5: Encrypt a value
  console.log("🔒 Encrypting value: 5");
  const encrypted = await client.encryptU32(5, CONTRACT_ADDRESS, userAddress);
  console.log("✅ Value encrypted successfully\n");

  // Step 6: Call contract with encrypted value
  console.log("📝 Calling increment(5) on contract...");
  const tx = await contract.increment(
    encrypted.handles[0],
    encrypted.inputProof,
  );
  console.log(`⏳ Transaction sent: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}\n`);

  // Step 7: Read counter value (encrypted handle)
  console.log("📖 Reading counter handle...");
  const counterHandle = await contract.getCount();
  console.log(`Counter handle: ${counterHandle}\n`);

  // Step 8: Decrypt the counter value
  console.log("🔓 Decrypting counter value...");
  const decrypted = await client.userDecrypt(
    [{ handle: counterHandle.toString(), contractAddress: CONTRACT_ADDRESS }],
    signer,
  );

  const counterValue = decrypted[counterHandle.toString()];
  console.log(`✅ Decrypted counter value: ${counterValue}\n`);

  // Step 9: Decrypt again (should use cached signature)
  console.log("🔓 Decrypting again (using cached signature)...");
  const decrypted2 = await client.userDecrypt(
    [{ handle: counterHandle.toString(), contractAddress: CONTRACT_ADDRESS }],
    signer,
  );
  console.log(
    `✅ Decrypted counter value: ${decrypted2[counterHandle.toString()]}\n`,
  );

  console.log("🎉 Example completed successfully!");
  console.log("\n📚 What we demonstrated:");
  console.log("  1. ✅ Framework-agnostic SDK (works in Node.js)");
  console.log("  2. ✅ Client initialization (<10 lines)");
  console.log("  3. ✅ Encryption (encryptU32)");
  console.log("  4. ✅ Contract interaction (incrementBy)");
  console.log("  5. ✅ Decryption with EIP-712 signing (userDecrypt)");
  console.log("  6. ✅ Signature caching (second decrypt is instant)");
}

// Run the example
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    console.error("\n💡 Make sure:");
    console.error("  1. Hardhat node is running: pnpm chain");
    console.error("  2. Contracts are deployed: pnpm deploy:localhost");
    console.error("  3. CONTRACT_ADDRESS is correct in index.js");
    process.exit(1);
  });
