
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MainnetContract, TestnetContract } from "./config";

type NetworkVariables = ReturnType<typeof useNetworkVariables>;

function createBetterTxFactory<T extends Record<string, unknown>>(
    fn: (tx: Transaction, networkVariables: NetworkVariables, params:T) => Transaction
) {
    return (networkVariables: NetworkVariables, params:T) => {
        const tx = new Transaction();
        return fn(tx, networkVariables, params);
    };
}

type Network = "mainnet" | "testnet"

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: TestnetContract,
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: MainnetContract,
    }
});

// 创建全局 SuiClient 实例
const suiClient = new SuiClient({ url: networkConfig[network].url });

export { useNetworkVariable, useNetworkVariables, networkConfig, network, suiClient, createBetterTxFactory };
export type { NetworkVariables };

