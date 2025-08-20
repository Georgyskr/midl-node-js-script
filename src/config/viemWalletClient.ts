import { getDefaultAccount, regtest } from "@midl-xyz/midl-js-core";
import { getEVMAddress, midlRegtest } from "@midl-xyz/midl-js-executor";
import { type Address, createWalletClient, http } from "viem";
import { midlConfig } from "./midlConfig";

export const getViemWalletClient = () => {
	const defaultAccount = getDefaultAccount(midlConfig);
	const evmAddress = getEVMAddress(defaultAccount, regtest);

	return createWalletClient({
		chain: midlRegtest,
		transport: http(midlRegtest.rpcUrls.default.http[0]),
		account: evmAddress as Address,
	});
};
