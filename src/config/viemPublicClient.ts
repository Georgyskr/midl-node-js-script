import { midlRegtest } from "@midl-xyz/midl-js-executor";
import { createPublicClient, http } from "viem";

export const getViemPublicClient = () => {
	return createPublicClient({
		chain: midlRegtest,
		transport: http(),
	});
};
