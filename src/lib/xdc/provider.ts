import { createPublicClient, http, type Address } from 'viem';

const DEFAULT_RPC_URL = 'https://rpc.xinfin.network';

const getRpcUrl = () => {
  return import.meta.env.VITE_XDC_RPC_URL ?? DEFAULT_RPC_URL;
};

export const getProvider = () => {
  return createPublicClient({
    transport: http(getRpcUrl()),
  });
};

export const getBlockNumber = async () => {
  const client = getProvider();
  return client.getBlockNumber();
};

export const getBalance = async (address: Address) => {
  const client = getProvider();
  return client.getBalance({ address });
};
