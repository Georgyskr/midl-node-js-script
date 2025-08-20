import { maxUint256, parseEther } from "viem";

export const transactionScenario = {
	// Transaction amounts
	depositAmount: parseEther("2"),
	withdrawAmount: parseEther("1"),

	// Rune configuration
	runeId: "37535:8", // TODO: Retrieve from an executor
	runeAmount: maxUint256,

	btcFeeRate: 4,

	addressPurposes: ["Payment", "Ordinals"] as const,
} as const;
