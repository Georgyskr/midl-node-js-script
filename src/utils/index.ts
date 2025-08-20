import { type Address, encodeFunctionData } from "viem";
import { getViemPublicClient } from "../config/viemPublicClient";
import contract from "../deployments/RunesRelayer.json";

export const createRunesRelayerTx = (
	functionName: "depositRune" | "withdrawRune",
	amount: bigint
) => {
	return encodeFunctionData({
		abi: contract.abi,
		functionName,
		args: [amount],
	});
};

export const getCollateralERC20Address = async () => {
	const publicClient = getViemPublicClient();

	const collateralAddress = await publicClient.readContract({
		address: contract.address as Address,
		abi: contract.abi,
		functionName: "collateralERC20",
	});

	return collateralAddress as Address;
};
