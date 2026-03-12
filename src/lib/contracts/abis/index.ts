import type { Abi } from 'viem';
import { masternodeManagerAbi } from './masternodeManager';

export type ContractAbiKey = 'masternodeManager';

const abiRegistry: Record<ContractAbiKey, Abi> = {
  masternodeManager: masternodeManagerAbi,
};

export const loadAbi = (key: ContractAbiKey): Abi => {
  return abiRegistry[key];
};
