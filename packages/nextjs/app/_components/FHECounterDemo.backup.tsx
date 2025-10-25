"use client";

import { useMemo, useState, useEffect } from "react";
import { useDecrypt, useEncrypt, useFhevmClient } from "@fhevm-sdk";
import { useAccount } from "wagmi";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { useEthersSigner } from "~~/hooks/useEthersSigner";
import deployedContracts from "~~/contracts/deployedContracts";

/**
 * FHECounter Demo - Zama Design System
 *
 * Modern, glassmorphic UI inspired by Zama's official design language:
 * - Black background with yellow accents
 * - Sharp corners (no border-radius)
 * - Glassmorphism effects
 * - Smooth animations
 */
export const FHECounterDemo = () => {
  const { isConnected, chain, address } = useAccount();
  const signer = useEthersSigner({ chainId: chain?.id });

  const chainId = chain?.id;
  const isLocalhost = chainId === 31337;
  const isSepolia = chainId === 11155111;
  const isSupportedNetwork = isLocalhost || isSepolia;

  // Debug logging on mount and connection changes
  useEffect(() => {
    console.log("[FHECounter] Component state:", {
      isConnected,
      chainId,
      chainName: chain?.name,
      address,
      isLocalhost,
      isSepolia,
      isSupportedNetwork,
    });
  }, [isConnected, chainId, chain?.name, address, isLocalhost, isSepolia, isSupportedNetwork]);

  // Get contract info based on network
  const contractAddress = chainId && (deployedContracts as any)[chainId]?.FHECounter?.address;
  const contractAbi = chainId && (deployedContracts as any)[chainId]?.FHECounter?.abi;

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM Client Initialization
  //////////////////////////////////////////////////////////////////////////////

  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, []);

  // Mock chains for local development
  const mockChains = { 31337: "http://localhost:8545" };

  const {
    client,
    status,
    error: clientError,
  } = useFhevmClient({
    provider,
    chainId,
    mockChains,
    enabled: isConnected,
  });

  // Debug logging for FHEVM client
  useEffect(() => {
    console.log("[FHECounter] FHEVM Client Status:", {
      status,
      hasClient: !!client,
      chainId,
      isConnected,
      error: clientError?.message,
    });
  }, [status, client, chainId, isConnected, clientError]);

  //////////////////////////////////////////////////////////////////////////////
  // Encryption & Decryption Hooks
  //////////////////////////////////////////////////////////////////////////////

  const { encryptU32, canEncrypt } = useEncrypt({
    client,
    contractAddress,
    userAddress: address,
  });

  // Debug logging for encryption
  useEffect(() => {
    console.log("[FHECounter] Encryption Status:", {
      canEncrypt,
      hasClient: !!client,
      contractAddress,
      userAddress: address,
    });
  }, [canEncrypt, client, contractAddress, address]);

  const { userDecrypt, isDecrypting } = useDecrypt({
    client,
    signer,
  });

  //////////////////////////////////////////////////////////////////////////////
  // Contract Interactions
  //////////////////////////////////////////////////////////////////////////////

  // Read encrypted counter handle
  const { data: encryptedHandle, refetch: refetchHandle } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: "getCount",
    query: {
      enabled: Boolean(contractAddress && isConnected),
    },
  });

  // Debug logging for contract reads
  useEffect(() => {
    console.log("[FHECounter] Contract Read:", {
      encryptedHandle,
      contractAddress,
      hasAbi: !!contractAbi,
    });
  }, [encryptedHandle, contractAddress, contractAbi]);

  // Write contract (increment/decrement)
  const { writeContract, data: txHash, isPending: isWriting } = useWriteContract();

  // Wait for transaction
  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Debug logging for transactions
  useEffect(() => {
    if (txHash) {
      console.log("[FHECounter] Transaction hash:", txHash);
    }
  }, [txHash]);

  useEffect(() => {
    console.log("[FHECounter] Transaction status:", {
      isWriting,
      isTxPending,
      txHash,
    });
  }, [isWriting, isTxPending, txHash]);

  // Refetch handle when transaction succeeds
  useEffect(() => {
    if (isTxSuccess) {
      console.log("[FHECounter] Transaction successful, refetching handle...");
      // Clear old decrypted value since counter changed
      setDecryptedValue(null);
      // Refetch the new encrypted handle
      refetchHandle();
    }
  }, [isTxSuccess, refetchHandle]);

  //////////////////////////////////////////////////////////////////////////////
  // State Management
  //////////////////////////////////////////////////////////////////////////////

  const [decryptedValue, setDecryptedValue] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isProcessing = isWriting || isTxPending;
  const isReady = status === "ready" && canEncrypt && contractAddress;

  //////////////////////////////////////////////////////////////////////////////
  // Helpers
  //////////////////////////////////////////////////////////////////////////////

  const uint8ArrayToHex = (arr: Uint8Array): `0x${string}` => {
    return `0x${Array.from(arr)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")}` as `0x${string}`;
  };

  //////////////////////////////////////////////////////////////////////////////
  // Handlers
  //////////////////////////////////////////////////////////////////////////////

  const handleIncrement = async () => {
    console.log("[FHECounter] Increment clicked", { isReady, contractAddress });
    if (!isReady || !contractAddress) return;

    try {
      setError(null);

      console.log("[FHECounter] Encrypting value 1...");
      // Encrypt the value 1
      const encrypted = await encryptU32(1);
      console.log("[FHECounter] Encryption successful:", {
        hasHandles: !!encrypted.handles,
        hasProof: !!encrypted.inputProof,
      });

      // Call contract
      if (contractAbi) {
        console.log("[FHECounter] Calling increment on contract...");
        writeContract({
          address: contractAddress as `0x${string}`,
          abi: contractAbi,
          functionName: "increment",
          args: [uint8ArrayToHex(encrypted.handles[0]), uint8ArrayToHex(encrypted.inputProof)],
        });
        // Note: Handle refetch happens automatically via useEffect when transaction succeeds
      }
    } catch (err: any) {
      console.error("[FHECounter] Increment error:", err);
      setError(err.message || "Failed to increment");
    }
  };

  const handleDecrement = async () => {
    console.log("[FHECounter] Decrement clicked", { isReady, contractAddress });
    if (!isReady || !contractAddress) return;

    try {
      setError(null);

      console.log("[FHECounter] Encrypting value 1...");
      // Encrypt the value 1
      const encrypted = await encryptU32(1);
      console.log("[FHECounter] Encryption successful:", {
        hasHandles: !!encrypted.handles,
        hasProof: !!encrypted.inputProof,
      });

      // Call contract
      if (contractAbi) {
        console.log("[FHECounter] Calling decrement on contract...");
        writeContract({
          address: contractAddress as `0x${string}`,
          abi: contractAbi,
          functionName: "decrement",
          args: [uint8ArrayToHex(encrypted.handles[0]), uint8ArrayToHex(encrypted.inputProof)],
        });
        // Note: Handle refetch happens automatically via useEffect when transaction succeeds
      }
    } catch (err: any) {
      console.error("[FHECounter] Decrement error:", err);
      setError(err.message || "Failed to decrement");
    }
  };

  const handleDecrypt = async () => {
    console.log("[FHECounter] Decrypt clicked", { encryptedHandle, contractAddress });
    
    // Force refetch the latest handle before decrypting
    console.log("[FHECounter] Refetching latest handle...");
    const { data: latestHandle } = await refetchHandle();
    const handleToDecrypt = latestHandle || encryptedHandle;
    
    console.log("[FHECounter] Using handle:", handleToDecrypt);
    
    if (!handleToDecrypt || !contractAddress) {
      console.log("[FHECounter] No handle to decrypt");
      return;
    }

    try {
      setError(null);

      console.log("[FHECounter] Decrypting handle:", handleToDecrypt);
      // Decrypt the handle
      const result = await userDecrypt([
        {
          handle: handleToDecrypt as string,
          contractAddress: contractAddress as `0x${string}`,
        },
      ]);

      console.log("[FHECounter] Decryption result:", result);

      // Get the decrypted value
      const value = result[handleToDecrypt as string];
      console.log("[FHECounter] Decrypted value:", { value, type: typeof value });

      if (typeof value === "bigint") {
        setDecryptedValue(value);
        console.log("[FHECounter] Set decrypted value (bigint):", value.toString());
      } else if (typeof value === "number") {
        setDecryptedValue(BigInt(value));
        console.log("[FHECounter] Set decrypted value (number->bigint):", value);
      }
    } catch (err: any) {
      console.error("[FHECounter] Decrypt error:", err);
      setError(err.message || "Failed to decrypt");
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  // UI Styles - Zama Design System
  //////////////////////////////////////////////////////////////////////////////

  // Primary button (Yellow - Zama style)
  const primaryButtonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold " +
    "bg-[#FED209] text-black border-0 " +
    "transition-all duration-300 ease-in-out " +
    "hover:scale-110 hover:-translate-y-0.5 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FED209] focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 " +
    "active:scale-105";

  // Secondary button (Outlined yellow - Zama style)
  const secondaryButtonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold " +
    "bg-[rgba(254,210,9,0.08)] text-[#FED209] border border-[rgba(254,210,9,0.25)] " +
    "backdrop-blur-[10px] " +
    "transition-all duration-300 ease-in-out " +
    "hover:bg-[#FED209] hover:text-black hover:scale-105 hover:-translate-y-0.5 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FED209] focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 " +
    "active:scale-100";

  // Card/Section styling (Glassmorphism)
  const cardClass =
    "bg-[rgba(0,0,0,0.4)] backdrop-blur-[15px] " +
    "border border-[rgba(254,210,9,0.25)] " +
    "p-6 mb-6 " +
    "transition-all duration-300";

  // Status card styling
  const statusCardClass =
    "bg-[rgba(255,255,255,0.08)] backdrop-blur-[10px] " +
    "border border-[rgba(254,210,9,0.15)] " +
    "p-4 " +
    "transition-all duration-300 hover:border-[rgba(254,210,9,0.35)]";

  //////////////////////////////////////////////////////////////////////////////
  // Render: Not Connected (Zama Style)
  //////////////////////////////////////////////////////////////////////////////

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className={cardClass + " text-center animate-[messageSlideIn_0.4s_ease-out]"}>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FED209] border border-[rgba(254,210,9,0.25)]">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="black" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="black" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Wallet Not Connected</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Connect your wallet to start using the FHE Counter and experience fully homomorphic encryption on Ethereum
            </p>
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////////////////////////////////////
  // Render: Wrong Network (Zama Style)
  //////////////////////////////////////////////////////////////////////////////

  if (!isSupportedNetwork) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className={cardClass + " text-center animate-[messageSlideIn_0.4s_ease-out]"}>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.25)]">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Unsupported Network</h2>
            <p className="text-gray-400 mb-6 text-sm">Please switch to one of the supported networks:</p>
            <div className="text-left mb-8 space-y-3 bg-[rgba(255,255,255,0.05)] p-4 border border-[rgba(254,210,9,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#FED209]"></div>
                <span className="font-mono text-sm text-gray-300">Localhost (Chain ID: 31337)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#FED209]"></div>
                <span className="font-mono text-sm text-gray-300">Sepolia Testnet (Chain ID: 11155111)</span>
              </div>
            </div>
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////////////////////////////////////
  // Render: Main Demo (Zama Style)
  //////////////////////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header - Zama Style */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src="/zama-logo.svg" alt="Zama" className="h-10 w-auto" style={{ filter: "brightness(0) saturate(100%) invert(85%) sepia(100%) saturate(2000%) hue-rotate(15deg) brightness(120%) contrast(120%)" }} />
              <div>
                <h1 className="text-2xl font-bold text-white">FHE Counter</h1>
                <p className="text-xs text-gray-400">Powered by Universal FHEVM SDK</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[rgba(254,210,9,0.08)] border border-[rgba(254,210,9,0.15)] px-4 py-2 text-xs">
                <div className="w-2 h-2 bg-[#FED209] animate-pulse"></div>
                <span className="text-gray-400">
                  {isLocalhost && "Localhost"}
                  {isSepolia && "Sepolia"}
                </span>
              </div>
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </header>

        {/* Status Section - Zama Style */}
        <div className={cardClass + " animate-[messageSlideIn_0.4s_ease-out]"}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FED209]"></div> System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={statusCardClass}>
              <div className="text-xs text-gray-400 mb-2">FHEVM Client</div>
              <div className="font-mono text-sm font-semibold">
                {status === "ready" ? (
                  <span className="text-[#FED209] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FED209]"></span> Ready
                  </span>
                ) : status === "sdk-loading" || status === "sdk-initializing" || status === "creating" ? (
                  <span className="text-yellow-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 animate-pulse"></span> Loading...
                  </span>
                ) : status === "error" ? (
                  <span className="text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400"></span> Error
                  </span>
                ) : (
                  <span className="text-gray-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500"></span> Idle
                  </span>
                )}
              </div>
            </div>

            <div className={statusCardClass}>
              <div className="text-xs text-gray-400 mb-2">Encryption</div>
              <div className="font-mono text-sm font-semibold">
                {canEncrypt ? (
                  <span className="text-[#FED209] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FED209]"></span> Ready
                  </span>
                ) : (
                  <span className="text-gray-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500"></span> Not Ready
                  </span>
                )}
              </div>
            </div>

            <div className={statusCardClass}>
              <div className="text-xs text-gray-400 mb-2">Contract</div>
              <div className="font-mono text-sm font-semibold">
                {contractAddress ? (
                  <span className="text-[#FED209] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FED209]"></span> Deployed
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400"></span> Not Found
                  </span>
                )}
              </div>
            </div>
          </div>

          {clientError && (
            <div className="mt-4 p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-red-400 text-sm backdrop-blur-[10px]">
              <strong className="text-red-300">Error:</strong> {clientError.message}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-red-400 text-sm backdrop-blur-[10px]">
              <strong className="text-red-300">Error:</strong> {error}
            </div>
          )}

          {!contractAddress && isSupportedNetwork && (
            <div className="mt-4 p-4 bg-[rgba(234,179,8,0.1)] border border-[rgba(234,179,8,0.3)] text-yellow-400 text-sm backdrop-blur-[10px]">
              <strong className="text-yellow-300">Contract Not Deployed:</strong> The FHECounter contract is not
              deployed on this network.
              {isSepolia && (
                <div className="mt-2">
                  To deploy to Sepolia, run:{" "}
                  <code className="bg-[#FED209] text-black px-2 py-1 font-mono text-xs">pnpm deploy:sepolia</code>
                </div>
              )}
              {isLocalhost && (
                <div className="mt-2">
                  To deploy locally, run:{" "}
                  <code className="bg-[#FED209] text-black px-2 py-1 font-mono text-xs">pnpm deploy:localhost</code>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Counter Section - Zama Style */}
        <div className={cardClass + " animate-[messageSlideIn_0.4s_ease-out_0.1s_both]"}>
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FED209]"></div> Encrypted Counter
          </h2>

          <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] border border-[rgba(254,210,9,0.2)] p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Current Value</div>
              <div className="text-7xl font-bold text-[#FED209] mb-4 font-mono tracking-tight">
                {decryptedValue !== null ? decryptedValue.toString() : "???"}
              </div>
              <div className="text-xs text-gray-500 font-mono break-all max-w-md mx-auto">
                {encryptedHandle ? (
                  <>
                    <span className="text-gray-600">Handle:</span>{" "}
                    <span className="text-[#FED209]">{(encryptedHandle as string).slice(0, 10)}</span>
                    <span className="text-gray-600">...</span>
                    <span className="text-[#FED209]">{(encryptedHandle as string).slice(-8)}</span>
                  </>
                ) : (
                  <span className="text-gray-600">No encrypted value yet</span>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-400 text-center mb-6 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FED209] animate-pulse"></span>
              Click <span className="text-[#FED209] font-semibold">Decrypt</span> to reveal the counter value
            </div>

            {/* Action Buttons - Zama Style */}
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Decrypt Button */}
              <button
                onClick={handleDecrypt}
                disabled={!encryptedHandle || isDecrypting || !isReady}
                className={primaryButtonClass}
                title={!isReady ? "Waiting for FHEVM client..." : "Decrypt the counter value"}
              >
                {isDecrypting ? "Decrypting..." : "Decrypt"}
              </button>

              {/* Increment Button */}
              <button
                onClick={handleIncrement}
                disabled={!isReady || isProcessing}
                className={secondaryButtonClass}
                title={!isReady ? "Waiting for FHEVM client..." : "Increment counter by 1"}
              >
                {isProcessing ? "Processing..." : "+ Increment"}
              </button>

              {/* Decrement Button */}
              <button
                onClick={handleDecrement}
                disabled={!isReady || isProcessing}
                className={secondaryButtonClass}
                title={!isReady ? "Waiting for FHEVM client..." : "Decrement counter by 1"}
              >
                {isProcessing ? "Processing..." : "- Decrement"}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section - Zama Style */}
        <div className={cardClass + " animate-[messageSlideIn_0.4s_ease-out_0.2s_both]"}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FED209]"></div> Contract Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(254,210,9,0.1)]">
              <span className="text-gray-400 min-w-[140px]">Contract Address:</span>
              <span className="text-[#FED209] break-all font-mono text-xs">
                {contractAddress || "Not deployed"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(254,210,9,0.1)]">
              <span className="text-gray-400 min-w-[140px]">Network:</span>
              <span className="text-white font-mono text-xs">
                {isLocalhost && "Localhost"}
                {isSepolia && "Sepolia Testnet"} <span className="text-gray-500">(Chain ID: {chainId})</span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(254,210,9,0.1)]">
              <span className="text-gray-400 min-w-[140px]">Your Address:</span>
              <span className="text-[#FED209] break-all font-mono text-xs">{address}</span>
            </div>
          </div>
        </div>

        {/* Features Section - Zama Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-[messageSlideIn_0.4s_ease-out_0.3s_both]">
          <div className={cardClass + " hover:border-[rgba(254,210,9,0.4)] transition-all duration-300"}>
            <h3 className="font-bold text-[#FED209] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FED209]"></span> Framework-Agnostic
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Core SDK works in any JavaScript environment - React, Vue, Node.js, or vanilla JS
            </p>
          </div>

          <div className={cardClass + " hover:border-[rgba(254,210,9,0.4)] transition-all duration-300"}>
            <h3 className="font-bold text-[#FED209] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FED209]"></span> Wagmi-Like API
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Familiar patterns: useFhevmClient, useEncrypt, useDecrypt
            </p>
          </div>

          <div className={cardClass + " hover:border-[rgba(254,210,9,0.4)] transition-all duration-300"}>
            <h3 className="font-bold text-[#FED209] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FED209]"></span> Type-Safe
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Full TypeScript support with auto-completion and type checking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
