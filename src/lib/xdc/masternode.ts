import type { Address } from 'viem';
import { getProvider } from './provider';
import { getContractAddress, loadContractAbi } from '../contracts/registry';

export type ValidatorInfo = {
  stake: bigint;
  signer: Address;
  status: number;
};

export const getValidatorInfo = async (
  validatorAddress: Address,
  chainId: number,
): Promise<ValidatorInfo> => {
  const contractAddress = getContractAddress('masternodeManager', chainId);

  if (!contractAddress) {
    throw new Error('Masternode manager contract address not configured.');
  }

  const client = getProvider();
  const abi = loadContractAbi('masternodeManager');

  const result = await client.readContract({
    address: contractAddress,
    abi,
    functionName: 'getValidatorInfo',
    args: [validatorAddress],
  });

  const [stake, signer, status] = result as readonly [
    bigint,
    Address,
    number,
  ];

  return {
    stake,
    signer,
    status,
  };
};

export const getCandidateCount = async (chainId: number) => {
  const contractAddress = getContractAddress('masternodeManager', chainId);

  if (!contractAddress) {
    throw new Error('Masternode manager contract address not configured.');
  }

  const client = getProvider();
  const abi = loadContractAbi('masternodeManager');

  return client.readContract({
    address: contractAddress,
    abi,
    functionName: 'candidateCount',
  }) as Promise<bigint>;
};

export const getCandidateCap = async (
  candidate: Address,
  chainId: number,
) => {
  const contractAddress = getContractAddress('masternodeManager', chainId);

  if (!contractAddress) {
    throw new Error('Masternode manager contract address not configured.');
  }

  const client = getProvider();
  const abi = loadContractAbi('masternodeManager');

  return client.readContract({
    address: contractAddress,
    abi,
    functionName: 'getCandidateCap',
    args: [candidate],
  }) as Promise<bigint>;
};

export const isCandidate = async (candidate: Address, chainId: number) => {
  const contractAddress = getContractAddress('masternodeManager', chainId);

  if (!contractAddress) {
    throw new Error('Masternode manager contract address not configured.');
  }

  const client = getProvider();
  const abi = loadContractAbi('masternodeManager');

  return client.readContract({
    address: contractAddress,
    abi,
    functionName: 'isCandidate',
    args: [candidate],
  }) as Promise<boolean>;
};
