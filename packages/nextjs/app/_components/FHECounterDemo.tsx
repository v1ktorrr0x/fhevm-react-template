"use client";

import { useMemo, useState, useEffect } from "react";
import { useDecrypt, useEncrypt, useFhevmClient } from "@fhevm-sdk";
import { useAccount } from "wagmi";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { useEthersSigner } from "~~/hooks/useEthersSigner";
import deployedContracts from "~~/contracts/deployedContracts";

/**
 * FHECounter Demo - Unified Flush Design
 *
 * A cohesive, modern interface showcasing FHEVM encryption capabilities:
 * - Unified glassmorphic surface with subtle internal separators
 * - Two-column layout: Counter (hero) + Status/Info (sidebar)
 * - Minimal borders and flush design for seamless flow
 * - Zama brand colors: Black background with yellow (#FED209) accents
 * - Smooth animations and micro-interactions
 * - Fully responsive with mobile-first approach
 */
export const FHECounterDemo = () => {
  const { isConnected, chain, address } = useAccount();
  const signer = useEthersSigner({ chainId: chain?.id });

  const chainId = chain?.id;
  const isLocalhost = chainId === 31337;
  const isSepolia = chainId === 11155111;
  const isSupportedNetwork = isLocalhost || isSepolia;

  // Network detection
  useEffect(() => {
    if (isConnected && !isSupportedNetwork) {
      console.warn("[FHECounter] Unsupported network detected:", chainId);
    }
  }, [isConnected, chainId, isSupportedNetwork]);

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

  // Mock chains for local development (memoized to prevent re-initialization)
  const mockChains = useMemo(() => ({ 31337: "http://localhost:8545" }), []);

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

  // Log client errors only
  useEffect(() => {
    if (clientError) {
      console.error("[FHECounter] FHEVM Client Error:", clientError.message);
    }
  }, [clientError]);

  //////////////////////////////////////////////////////////////////////////////
  // Encryption & Decryption Hooks
  //////////////////////////////////////////////////////////////////////////////

  const { encryptU32, canEncrypt } = useEncrypt({
    client,
    contractAddress,
    userAddress: address,
  });



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



  // Write contract (increment/decrement)
  const { writeContract, data: txHash, isPending: isWriting } = useWriteContract();

  // Wait for transaction
  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });



  // Refetch handle when transaction succeeds
  useEffect(() => {
    if (isTxSuccess) {
      setDecryptedValue(null);
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
    if (!isReady || !contractAddress) return;

    try {
      setError(null);
      const encrypted = await encryptU32(1);

      if (contractAbi) {
        writeContract({
          address: contractAddress as `0x${string}`,
          abi: contractAbi,
          functionName: "increment",
          args: [uint8ArrayToHex(encrypted.handles[0]), uint8ArrayToHex(encrypted.inputProof)],
        });
      }
    } catch (err: any) {
      console.error("[FHECounter] Increment failed:", err);
      setError(err.message || "Failed to increment");
    }
  };

  const handleDecrement = async () => {
    if (!isReady || !contractAddress) return;

    try {
      setError(null);
      const encrypted = await encryptU32(1);

      if (contractAbi) {
        writeContract({
          address: contractAddress as `0x${string}`,
          abi: contractAbi,
          functionName: "decrement",
          args: [uint8ArrayToHex(encrypted.handles[0]), uint8ArrayToHex(encrypted.inputProof)],
        });
      }
    } catch (err: any) {
      console.error("[FHECounter] Decrement failed:", err);
      setError(err.message || "Failed to decrement");
    }
  };

  const handleDecrypt = async () => {
    // Refetch the latest handle before decrypting
    const { data: latestHandle } = await refetchHandle();
    const handleToDecrypt = latestHandle || encryptedHandle;
    
    if (!handleToDecrypt || !contractAddress) return;

    // Check if handle is zero (uninitialized counter)
    const zeroHandle = "0x0000000000000000000000000000000000000000000000000000000000000000";
    if (handleToDecrypt === zeroHandle) {
      setDecryptedValue(BigInt(0));
      return;
    }

    try {
      setError(null);

      const result = await userDecrypt([
        {
          handle: handleToDecrypt as string,
          contractAddress: contractAddress as `0x${string}`,
        },
      ]);

      const value = result[handleToDecrypt as string];

      if (typeof value === "bigint") {
        setDecryptedValue(value);
      } else if (typeof value === "number") {
        setDecryptedValue(BigInt(value));
      }
    } catch (err: any) {
      console.error("[FHECounter] Decrypt failed:", err);
      setError(err.message || "Failed to decrypt");
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  // Design Tokens - Unified Flush Design System
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Color palette for the unified design system
   * Uses subtle variations for depth without heavy borders
   */
  const COLORS = {
    zamaYellow: '#FED209',
    black: '#000000',
    white: '#ffffff',
    // Glassmorphism backgrounds
    glassLight: 'rgba(255, 255, 255, 0.08)',
    glassDark: 'rgba(0, 0, 0, 0.4)',
    glassSubtle: 'rgba(255, 255, 255, 0.05)',
    glassVerySubtle: 'rgba(255, 255, 255, 0.03)',
    // Yellow variations
    yellowBg: 'rgba(254, 210, 9, 0.08)',
    yellowBorder: 'rgba(254, 210, 9, 0.25)',
    yellowBorderLight: 'rgba(254, 210, 9, 0.15)',
    yellowBorderHover: 'rgba(254, 210, 9, 0.4)',
    yellowBorderGlow: 'rgba(254, 210, 9, 0.2)',
    // Status colors
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    errorBorder: 'rgba(239, 68, 68, 0.3)',
    errorLight: 'rgba(239, 68, 68, 0.15)',
    errorBorderLight: 'rgba(239, 68, 68, 0.25)',
    warning: '#FBBF24',
    warningBg: 'rgba(234, 179, 8, 0.1)',
    warningBorder: 'rgba(234, 179, 8, 0.3)',
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    textTertiary: '#6b7280',
    textMuted: '#4b5563',
  };

  // Spacing Scale (based on 4px grid)
  const SPACING = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  };

  //////////////////////////////////////////////////////////////////////////////
  // UI Styles - Organized by Component
  //////////////////////////////////////////////////////////////////////////////

  // Primary button (Yellow - Zama style) - Enhanced for better impact
  const primaryButtonClass =
    "inline-flex items-center justify-center px-8 py-4 min-w-[160px] font-semibold " +
    "bg-[#FED209] text-black border-0 " +
    "transition-all duration-300 ease-in-out " +
    "hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(254,210,9,0.4)] " +
    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#FED209] focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none " +
    "active:scale-105";

  // Secondary button (Outlined yellow - Zama style) - Enhanced glassmorphism
  const secondaryButtonClass =
    "inline-flex items-center justify-center px-8 py-4 min-w-[160px] font-semibold " +
    "bg-[rgba(254,210,9,0.08)] text-[#FED209] border border-[rgba(254,210,9,0.25)] " +
    "backdrop-blur-[15px] " +
    "transition-all duration-300 ease-in-out " +
    "hover:bg-[#FED209] hover:text-black hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(254,210,9,0.3)] " +
    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#FED209] focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:bg-[rgba(254,210,9,0.08)] disabled:hover:text-[#FED209] disabled:hover:shadow-none " +
    "active:scale-102";

  /**
   * Main container - single unified glassmorphic surface
   * All content lives within this cohesive container
   */
  const unifiedContainerClass =
    "bg-[rgba(0,0,0,0.6)] backdrop-blur-[20px] " +
    "border border-[rgba(254,210,9,0.15)] " +
    "transition-all duration-300";

  /**
   * Section styles - subtle separators instead of heavy borders
   */
  const sectionClass =
    "p-8 " +
    "border-b border-[rgba(254,210,9,0.08)] last:border-b-0 " +
    "transition-all duration-300";

  const compactSectionClass =
    "p-6 " +
    "border-b border-[rgba(254,210,9,0.08)] last:border-b-0 " +
    "transition-all duration-300";

  /**
   * Item styles - left border accent on hover for subtle interaction feedback
   */
  const statusItemClass =
    "p-4 " +
    "bg-[rgba(255,255,255,0.03)] " +
    "border-l-2 border-transparent " +
    "transition-all duration-300 " +
    "hover:bg-[rgba(255,255,255,0.05)] hover:border-l-[#FED209]";

  const infoRowClass =
    "p-4 " +
    "bg-[rgba(255,255,255,0.02)] " +
    "border-l-2 border-transparent " +
    "transition-all duration-300 " +
    "hover:bg-[rgba(255,255,255,0.04)] hover:border-l-[#FED209]";

  // Section heading style - subtle
  const sectionHeadingClass =
    "text-lg font-bold text-white mb-6 flex items-center gap-2 opacity-90";

  // Bullet point style
  const bulletClass =
    "w-1 h-1 bg-[#FED209] opacity-60";

  // Status indicator dot
  const statusDotClass = "w-2.5 h-2.5";

  //////////////////////////////////////////////////////////////////////////////
  // Render: Not Connected (Zama Style)
  //////////////////////////////////////////////////////////////////////////////

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className={unifiedContainerClass + " text-center animate-[messageSlideIn_0.4s_ease-out]"}>
            <div className="p-12">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[rgba(254,210,9,0.1)] border-2 border-[rgba(254,210,9,0.3)]">
                  <svg className="w-12 h-12 text-[#FED209]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.2" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Wallet Not Connected</h2>
              <p className="text-gray-400 mb-10 text-base leading-relaxed">
                Connect your wallet to start using the FHE Counter and experience fully homomorphic encryption on Ethereum
              </p>
              <RainbowKitCustomConnectButton />
            </div>
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
          <div className={unifiedContainerClass + " text-center animate-[messageSlideIn_0.4s_ease-out]"}>
            <div className="p-12">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[rgba(239,68,68,0.1)] border-2 border-[rgba(239,68,68,0.3)]">
                  <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Unsupported Network</h2>
              <p className="text-gray-400 mb-8 text-base">Please switch to one of the supported networks:</p>
              <div className="text-left mb-10 space-y-3 bg-[rgba(255,255,255,0.02)] p-6 border-l-2 border-[rgba(254,210,9,0.3)]">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#FED209] rounded-full"></div>
                  <span className="font-mono text-sm text-gray-300">Localhost (Chain ID: 31337)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#FED209] rounded-full"></div>
                  <span className="font-mono text-sm text-gray-300">Sepolia Testnet (Chain ID: 11155111)</span>
                </div>
              </div>
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////////////////////////////////////
  // Render: Main Demo (Zama Style)
  //////////////////////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Enhanced Zama Style */}
        <header className="mb-12 animate-[messageSlideIn_0.3s_ease-out]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <img 
                src="/zama-logo.svg" 
                alt="Zama" 
                className="h-12 w-auto" 
                style={{ filter: "brightness(0) saturate(100%) invert(85%) sepia(100%) saturate(2000%) hue-rotate(15deg) brightness(120%) contrast(120%)" }} 
              />
              <div>
                <h1 className="text-3xl font-bold text-white">FHE Counter</h1>
                <p className="text-sm text-gray-400 mt-1">Powered by Universal FHEVM SDK</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[rgba(254,210,9,0.08)] backdrop-blur-[15px] border border-[rgba(254,210,9,0.15)] px-5 py-2.5 text-sm">
                <div className="w-2.5 h-2.5 bg-[#FED209] rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-medium">
                  {isLocalhost && "Localhost"}
                  {isSepolia && "Sepolia"}
                </span>
              </div>
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </header>

        {/* Main Content - Unified Surface */}
        <div className={unifiedContainerClass + " animate-[messageSlideIn_0.4s_ease-out]"}>
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* Left Column - Counter Display (Hero) */}
            <div className="lg:col-span-7 lg:border-r lg:border-[rgba(254,210,9,0.08)]">
              {/* Counter Section - Hero Element */}
              <div className={sectionClass}>
                <h2 className={sectionHeadingClass}>
                  <div className={bulletClass}></div> Encrypted Counter
                </h2>

                <div className="bg-[rgba(255,255,255,0.02)] p-12 mb-6">
                <div className="text-center mb-10">
                  <div className="text-xs text-gray-400 mb-4 uppercase tracking-[0.2em]">Current Value</div>
                  <div 
                    className={`text-8xl md:text-9xl font-bold text-[#FED209] mb-6 font-mono tracking-tight transition-all duration-400 ${
                      isDecrypting ? 'animate-pulse opacity-70' : ''
                    }`}
                    style={{
                      textShadow: '0 0 30px rgba(254, 210, 9, 0.3)',
                    }}
                  >
                    {decryptedValue !== null ? decryptedValue.toString() : "???"}
                  </div>
                  <div className="text-xs text-gray-500 font-mono break-all max-w-lg mx-auto">
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

                <div className="text-sm text-gray-400 text-center mb-8 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-[#FED209] rounded-full animate-pulse"></span>
                  Click <span className="text-[#FED209] font-semibold">Decrypt</span> to reveal the counter value
                </div>

                {/* Action Buttons - Enhanced */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center items-stretch sm:items-center">
                  {/* Decrypt Button */}
                  <button
                    onClick={handleDecrypt}
                    disabled={!encryptedHandle || isDecrypting || !isReady}
                    className={primaryButtonClass}
                    aria-label="Decrypt counter value"
                    title={!isReady ? "Waiting for FHEVM client..." : "Decrypt the counter value"}
                  >
                    {isDecrypting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Decrypting...
                      </span>
                    ) : "🔓 Decrypt"}
                  </button>

                  {/* Increment Button */}
                  <button
                    onClick={handleIncrement}
                    disabled={!isReady || isProcessing}
                    className={secondaryButtonClass}
                    aria-label="Increment counter by one"
                    title={!isReady ? "Waiting for FHEVM client..." : "Increment counter by 1"}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : "+ Increment"}
                  </button>

                  {/* Decrement Button */}
                  <button
                    onClick={handleDecrement}
                    disabled={!isReady || isProcessing}
                    className={secondaryButtonClass}
                    aria-label="Decrement counter by one"
                    title={!isReady ? "Waiting for FHEVM client..." : "Decrement counter by 1"}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : "- Decrement"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Info */}
          <div className="lg:col-span-5">
            {/* Status Section - Compact */}
            <div className={compactSectionClass}>
              <h2 className={sectionHeadingClass}>
                <div className={bulletClass}></div> System Status
              </h2>
              <div className="space-y-2">
                <div className={statusItemClass}>
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">FHEVM Client</div>
                  <div className="font-mono text-sm font-semibold">
                    {status === "ready" ? (
                      <span className="text-[#FED209] flex items-center gap-2">
                        <span className={statusDotClass + " bg-[#FED209] rounded-full"}></span> Ready
                      </span>
                    ) : status === "sdk-loading" || status === "sdk-initializing" || status === "creating" ? (
                      <span className="text-yellow-400 flex items-center gap-2">
                        <span className={statusDotClass + " bg-yellow-400 rounded-full animate-[pulse_1s_ease-in-out_infinite]"}></span> Loading...
                      </span>
                    ) : status === "error" ? (
                      <span className="text-red-400 flex items-center gap-2">
                        <span className={statusDotClass + " bg-red-400 rounded-full"}></span> Error
                      </span>
                    ) : (
                      <span className="text-gray-500 flex items-center gap-2">
                        <span className={statusDotClass + " bg-gray-500 rounded-full"}></span> Idle
                      </span>
                    )}
                  </div>
                </div>

                <div className={statusItemClass}>
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Encryption</div>
                  <div className="font-mono text-sm font-semibold">
                    {canEncrypt ? (
                      <span className="text-[#FED209] flex items-center gap-2">
                        <span className={statusDotClass + " bg-[#FED209] rounded-full"}></span> Ready
                      </span>
                    ) : (
                      <span className="text-gray-500 flex items-center gap-2">
                        <span className={statusDotClass + " bg-gray-500 rounded-full"}></span> Not Ready
                      </span>
                    )}
                  </div>
                </div>

                <div className={statusItemClass}>
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Contract</div>
                  <div className="font-mono text-sm font-semibold">
                    {contractAddress ? (
                      <span className="text-[#FED209] flex items-center gap-2">
                        <span className={statusDotClass + " bg-[#FED209] rounded-full"}></span> Deployed
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-2">
                        <span className={statusDotClass + " bg-red-400 rounded-full"}></span> Not Found
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {clientError && (
                <div className="mt-4 p-4 bg-[rgba(239,68,68,0.15)] border-2 border-[rgba(239,68,68,0.4)] text-red-400 text-sm backdrop-blur-[15px] animate-[messageSlideIn_0.3s_ease-out]" role="alert" aria-live="assertive">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <strong className="text-red-300 font-bold">Error:</strong> {clientError.message}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-[rgba(239,68,68,0.15)] border-2 border-[rgba(239,68,68,0.4)] text-red-400 text-sm backdrop-blur-[15px] animate-[messageSlideIn_0.3s_ease-out]" role="alert" aria-live="assertive">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <strong className="text-red-300 font-bold">Error:</strong> {error}
                    </div>
                  </div>
                </div>
              )}

              {!contractAddress && isSupportedNetwork && (
                <div className="mt-4 p-4 bg-[rgba(234,179,8,0.15)] border-2 border-[rgba(234,179,8,0.4)] text-yellow-400 text-sm backdrop-blur-[15px]">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <strong className="text-yellow-300 font-bold">Contract Not Deployed:</strong> The FHECounter contract is not deployed on this network.
                      {isSepolia && (
                        <div className="mt-2">
                          To deploy to Sepolia, run:{" "}
                          <code className="bg-[#FED209] text-black px-2 py-1 font-mono text-xs rounded">pnpm deploy:sepolia</code>
                        </div>
                      )}
                      {isLocalhost && (
                        <div className="mt-2">
                          To deploy locally, run:{" "}
                          <code className="bg-[#FED209] text-black px-2 py-1 font-mono text-xs rounded">pnpm deploy:localhost</code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contract Info Section - Compact */}
            <div className={compactSectionClass}>
              <h2 className={sectionHeadingClass}>
                <div className={bulletClass}></div> Contract Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className={infoRowClass + " flex flex-col gap-1"}>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Contract Address</span>
                  <span className="text-[#FED209] break-all font-mono text-xs">
                    {contractAddress || "Not deployed"}
                  </span>
                </div>
                <div className={infoRowClass + " flex flex-col gap-1"}>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Network</span>
                  <span className="text-white font-mono text-xs">
                    {isLocalhost && "Localhost"}
                    {isSepolia && "Sepolia Testnet"} <span className="text-gray-500">(Chain ID: {chainId})</span>
                  </span>
                </div>
                <div className={infoRowClass + " flex flex-col gap-1"}>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Your Address</span>
                  <span className="text-[#FED209] break-all font-mono text-xs">{address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Features Section - Unified Surface */}
        <div className={unifiedContainerClass + " mt-8 animate-[messageSlideIn_0.4s_ease-out_0.2s_both]"}>
          <div className={sectionClass + " border-b-0"}>
            <h2 className={sectionHeadingClass + " text-center mb-8"}>
              <div className="flex items-center justify-center gap-2">
                <div className={bulletClass}></div>
                <span>SDK Features</span>
                <div className={bulletClass}></div>
              </div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x-0 md:divide-x md:divide-[rgba(254,210,9,0.08)]">
              <div className="p-6 text-center transition-all duration-300 hover:bg-[rgba(255,255,255,0.02)] border-b md:border-b-0 border-[rgba(254,210,9,0.08)]">
                <div className="text-4xl mb-4 opacity-80">🔧</div>
                <h3 className="font-bold text-[#FED209] text-base mb-3">
                  Framework-Agnostic
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Core SDK works in any JavaScript environment - React, Vue, Node.js, or vanilla JS
                </p>
              </div>

              <div className="p-6 text-center transition-all duration-300 hover:bg-[rgba(255,255,255,0.02)] border-b md:border-b-0 border-[rgba(254,210,9,0.08)]">
                <div className="text-4xl mb-4 opacity-80">⚡</div>
                <h3 className="font-bold text-[#FED209] text-base mb-3">
                  Wagmi-Like API
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Familiar patterns: useFhevmClient, useEncrypt, useDecrypt
                </p>
              </div>

              <div className="p-6 text-center transition-all duration-300 hover:bg-[rgba(255,255,255,0.02)]">
                <div className="text-4xl mb-4 opacity-80">🛡️</div>
                <h3 className="font-bold text-[#FED209] text-base mb-3">
                  Type-Safe
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Full TypeScript support with auto-completion and type checking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
