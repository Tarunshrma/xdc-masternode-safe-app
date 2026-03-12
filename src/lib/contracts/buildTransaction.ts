import { encodeFunctionData, type Address } from 'viem';
import { getContractAddress, loadContractAbi } from './registry';

export type TransactionPayload = {
  to: Address;
  data: `0x${string}`;
  value: bigint;
};

type BuildTransactionParams = {
  chainId: number;
  contractKey: 'masternodeManager';
  functionName: 'propose' | 'vote' | 'unvote' | 'resign' | 'withdraw';
  args: readonly unknown[];
  value?: bigint;
};

export const buildTransaction = ({
  chainId,
  contractKey,
  functionName,
  args,
  value = 0n,
}: BuildTransactionParams): TransactionPayload => {
  const to = getContractAddress(contractKey, chainId);

  if (!to) {
    throw new Error('Contract address not configured for chain.');
  }

  const data = encodeFunctionData({
    abi: loadContractAbi(contractKey),
    functionName,
    args,
  });

  return {
    to,
    data,
    value,
  };
};
