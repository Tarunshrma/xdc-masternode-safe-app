import type { Address, Abi } from 'viem';
import { loadAbi, type ContractAbiKey } from './abis';

type ChainId = number;

export type ContractKey = 'masternodeManager';

export type ContractRegistryEntry = {
  key: ContractKey;
  name: string;
  abiKey: ContractAbiKey;
  addresses: Partial<Record<ChainId, Address>>;
};

const getEnvAddress = (key: string) => {
  const value = import.meta.env[key] as string | undefined;
  return value ?? null;
};

const xdcStakingContractAddress = getEnvAddress(
  'VITE_STAKING_CONTRACT_ADDRESS',
);

const masternodeManagerAddresses: Partial<Record<ChainId, Address>> = {};

if (xdcStakingContractAddress) {
  masternodeManagerAddresses[50] = xdcStakingContractAddress as Address;
}

const contractRegistry: Record<ContractKey, ContractRegistryEntry> = {
  masternodeManager: {
    key: 'masternodeManager',
    name: 'Masternode Manager',
    abiKey: 'masternodeManager',
    // TODO: Replace with real contract addresses and ABI keys.
    addresses: masternodeManagerAddresses,
  },
};

export const getContractEntry = (key: ContractKey): ContractRegistryEntry => {
  return contractRegistry[key];
};

export const loadContractAbi = (key: ContractKey): Abi => {
  const entry = getContractEntry(key);
  return loadAbi(entry.abiKey);
};

export const getContractAddress = (
  key: ContractKey,
  chainId: number | string | null,
): Address | null => {
  if (chainId === null) {
    return null;
  }
  const entry = getContractEntry(key);
  return entry.addresses[Number(chainId)] ?? null;
};
