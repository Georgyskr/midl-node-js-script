import { AddressType, createConfig, regtest } from "@midl-xyz/midl-js-core";
import { keyPairConnector } from "@midl-xyz/midl-js-node";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MNEMONIC) {
	throw new Error("MNEMONIC environment variable is required. Please check your .env file.");
}

export const midlConfig = createConfig({
	networks: [regtest],
	connectors: [
		keyPairConnector({
			mnemonic: process.env.MNEMONIC,
			paymentAddressType: AddressType.P2WPKH,
		}),
	],
});
