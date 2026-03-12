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

const contractRegistry: Record<ContractKey, ContractRegistryEntry> = {
  masternodeManager: {
    key: 'masternodeManager',
    name: 'Masternode Manager',
    abiKey: 'masternodeManager',
    // TODO: Replace with real contract addresses and ABI keys.
    addresses: {},
  },
};

export const getContractEntry = (key: ContractKey): ContractRegistryEntry => {
  return contractRegistry[key];
};

export const loadContractAbi = (key: ContractKey): Abi => {
  const entry = getContractEntry(key);
  return loadAbi(entry.abiKey);
};
