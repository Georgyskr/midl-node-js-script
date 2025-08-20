import deployment from "@midl-xyz/contracts/deployments/0.1.1/Executor.json";
import { AddressPurpose, connect, getDefaultAccount, regtest } from "@midl-xyz/midl-js-core";
import {
	addCompleteTxIntention,
	addTxIntention,
	bytes32toRuneId,
	executorAbi,
	finalizeBTCTransaction,
	getEVMAddress,
	signIntention,
} from "@midl-xyz/midl-js-executor";
import { type Address, encodeFunctionData, erc20Abi, maxUint256 } from "viem";
import { midlConfig } from "./config";
import { transactionScenario } from "./config/scenario";
import { getViemPublicClient } from "./config/viemPublicClient";
import { getViemWalletClient } from "./config/viemWalletClient";
import contract from "./deployments/RunesRelayer.json";
import { createRunesRelayerTx, getCollateralERC20Address } from "./utils";

async function main() {
	try {
		const publicClient = getViemPublicClient();

		await connect(midlConfig, { purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals] });
		const defaultAccount = getDefaultAccount(midlConfig);

		const walletClient = getViemWalletClient();

		console.log(
			"Network connected with btc address:",
			defaultAccount.address,
			" & EVM address: ",
			getEVMAddress(defaultAccount, regtest)
		);

		const collateralERC20Address = await getCollateralERC20Address();

		const bytes32RuneId = await publicClient.readContract({
			abi: executorAbi,
			functionName: "getRuneIdByAssetAddress",
			address: deployment.address as Address,
			args: [collateralERC20Address],
		});

		const runeId = bytes32toRuneId(bytes32RuneId);
		console.log("Rune Id required for transaction execution is: ", runeId);
		console.log("Collateral ERC20 address:", collateralERC20Address);

		const localUnsignedIntentions = [];
		try {
			const approveData = encodeFunctionData({
				abi: erc20Abi,
				functionName: "approve",
				args: [contract.address as Address, transactionScenario.depositAmount],
			});

			const approveIntention = await addTxIntention(midlConfig, {
				evmTransaction: {
					to: collateralERC20Address as Address,
					data: approveData,
				},
			});

			const depositTxData = createRunesRelayerTx("depositRune", transactionScenario.depositAmount);

			const depositIntention = await addTxIntention(midlConfig, {
				evmTransaction: {
					to: contract.address as Address,
					data: depositTxData,
				},
				deposit: {
					runes: [
						{
							id: runeId,
							amount: transactionScenario.depositAmount,
							address: collateralERC20Address as Address,
						},
					],
				},
			});

			const withdrawTxData = createRunesRelayerTx(
				"withdrawRune",
				transactionScenario.withdrawAmount
			);

			const withdrawIntention = await addTxIntention(midlConfig, {
				evmTransaction: {
					to: contract.address as Address,
					data: withdrawTxData,
				},
			});

			const completeTxIntention = await addCompleteTxIntention(midlConfig, {
				runes: [
					{
						id: runeId,
						amount: maxUint256,
						address: collateralERC20Address as Address,
					},
				],
			});

			localUnsignedIntentions.push(
				approveIntention,
				depositIntention,
				withdrawIntention,
				completeTxIntention
			);

			console.log(
				localUnsignedIntentions.length,
				"intentions created. Proceeding to finalize BTC transaction..."
			);
			const btcTx = await finalizeBTCTransaction(
				midlConfig,
				localUnsignedIntentions,
				walletClient,
				{ feeRate: transactionScenario.btcFeeRate }
			);

			console.log("BTC Tx Finalized. Proceeding to signing intentions...");

			const serializedTransactions: Address[] = [];
			for (const intention of localUnsignedIntentions) {
				serializedTransactions.push(
					await signIntention(midlConfig, walletClient, intention, localUnsignedIntentions, {
						txId: btcTx.tx.id,
					})
				);
			}

			const txHash = await publicClient.sendBTCTransactions({
				btcTransaction: btcTx?.tx.hex,
				serializedTransactions,
			});
			console.log("BTC Tx Hash sent: ", txHash);
		} catch (txError) {
			console.error("Transaction error:", txError);
		}
	} catch (error) {
		console.error("Application error:", error);
		process.exit(1);
	}
}

if (require.main === module) {
	main().catch((error) => {
		console.error("Unhandled error:", error);
		process.exit(1);
	});
}

export { main };
